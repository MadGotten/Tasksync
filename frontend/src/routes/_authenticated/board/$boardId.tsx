import styles from "./board.module.css";
import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { List } from "@/features/lists/components/List";
import { Task } from "@/features/tasks/components/Task";
import { DndContext, DragOverlay, useSensor, PointerSensor, useSensors } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Plane, Button } from "@/components/ui";
import { DropdownBoard } from "@/features/boards/components/DropdownBoard";
import { createPortal } from "react-dom";
import { useListOperations } from "@/hooks/useListOperations";
import { useBoardDragDrop } from "@/hooks/useBoardDragDrop";
import { VisibilityIcon } from "@/assets/icons";
import { useGetTasks } from "@/features/tasks/api/useGetTasks";
import { CreateColumn } from "@/features/lists/components/CreateColumn";
import { getBoardQueryOptions } from "@/features/boards/api/useGetBoard";
import { ErrorPage } from "@/components/ErrorPage";
import { Role } from "@/types/enums";
import { isAuthorized } from "@/utils/permissions";
import { Authorized } from "@/components/Authorized";
import { keycloak } from "@/api/keycloak";

export const Route = createFileRoute("/_authenticated/board/$boardId")({
  loader: async ({ params, context }) => {
    const { boardId } = params;
    if (!keycloak.authenticated) {
      throw new Error("User is not authenticated");
    }
    const data = await context.queryClient.ensureQueryData(getBoardQueryOptions(boardId));
    return data;
  },
  component: RouteComponent,
  errorComponent: () => {
    return <ErrorPage />;
  },
  head: (ctx) => {
    const { boardId } = ctx.params;
    return {
      meta: [
        {
          title: `Board ${boardId} | TaskSync`,
        },
      ],
    };
  },
});

function RouteComponent() {
  const { boardId } = Route.useParams();
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: "/board/$boardId/tasks/$taskId" });

  const board = Route.useLoaderData();
  const [showArchived, setShowArchived] = useState(false);

  const { data: tasks = [] } = useGetTasks({
    boardId: parseInt(boardId),
    showArchived,
    options: {
      enabled: !params,
    },
  });

  const { lists: columns = [] } = useListOperations({ boardId, options: { enabled: !params } });

  const { draggedTask, draggedColumn, handleDragStart, handleDragEnd, handleDragOver } =
    useBoardDragDrop(parseInt(boardId), tasks, showArchived);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const listsId = useMemo(() => {
    return columns?.map((column) => column.id) || [];
  }, [columns]);

  const handleArchiveToggle = () => {
    setShowArchived((prev) => !prev);
  };

  return (
    <Plane full>
      <Plane.Header>
        <Plane.Title>{board?.name}</Plane.Title>
        <Plane.Icons>
          <Button size='sm' fs='sm' onClick={handleArchiveToggle}>
            <VisibilityIcon showArchived={showArchived} />
            Archived
          </Button>
          <Authorized boardId={boardId} role='MEMBER'>
            <CreateColumn boardId={boardId} />
          </Authorized>
          <DropdownBoard boardId={boardId} />
        </Plane.Icons>
      </Plane.Header>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className={styles.boards}>
          <SortableContext
            items={listsId}
            strategy={horizontalListSortingStrategy}
            disabled={!isAuthorized(board.member_role, Role.MEMBER)}
          >
            {columns.map((column) => (
              <List
                key={column.id}
                column={column}
                memberRole={board.member_role}
                tasks={tasks.filter((task) => task.column_id === column.id)}
              />
            ))}
          </SortableContext>
          {createPortal(
            <DragOverlay>
              {draggedTask && (
                <Task
                  boardId={parseInt(boardId)}
                  memberRole={board.member_role}
                  isDragged={true}
                  task={draggedTask}
                />
              )}
              {draggedColumn && (
                <List
                  column={draggedColumn}
                  memberRole={board.member_role}
                  tasks={tasks.filter((task) => task.column_id === draggedColumn.id)}
                  isDragged={true}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </div>
      </DndContext>
      <Outlet />
    </Plane>
  );
}
