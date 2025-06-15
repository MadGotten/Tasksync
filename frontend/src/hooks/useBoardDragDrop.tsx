import { useState } from "react";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { useItemDragHandler } from "./useItemDragHandler";
import { useListOperations } from "./useListOperations";
import { useMoveTaskBetweenList } from "@/features/tasks/api/useMoveTaskBetweenList";
import { useReorderTasks } from "@/features/tasks/api/useReorderTasks";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/api";
import { arrayMove } from "@dnd-kit/sortable";
import { Priority } from "@/types/enums";
import { Ordering } from "@/utils/ordering";
import { useMatchRoute } from "@tanstack/react-router";

export function useBoardDragDrop(boardId: number, tasks: Task[], showArchived: boolean) {
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: "/board/$boardId/tasks/$taskId" });
  const queryClient = useQueryClient();
  const [draggedTask, setDraggedTask] = useState<any | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<any | null>(null);

  const [lastTask, setLastTask] = useState<any | null>(null);

  const mutateMoveTaskBetweenLists = useMoveTaskBetweenList({ boardId });
  const mutateMoveTaskWithinList = useMoveTaskBetweenList({ boardId });
  const mutateReorder = useReorderTasks({ boardId });

  const applyOptimisticTaskUpdate = (taskToUpdate: Task) => {
    queryClient.setQueryData(
      ["tasks", boardId, { archived: showArchived }],
      (oldData: Task[] | undefined) => {
        if (!oldData) return oldData;

        return oldData
          .map((t) =>
            t.id === taskToUpdate.id
              ? { ...t, position: taskToUpdate.position, column_id: taskToUpdate.column_id }
              : t
          )
          .sort((a, b) => a.position - b.position);
      }
    );
  };

  const moveTaskBetweenLists = (task: Task) => {
    applyOptimisticTaskUpdate(task);
    return mutateMoveTaskBetweenLists.mutate(task);
  };

  // Move task within the same list
  const moveTaskWithinList = (task: Task) => {
    applyOptimisticTaskUpdate(task);
    return mutateMoveTaskWithinList.mutate(task);
  };

  const { lists: columns = [], updateLists } = useListOperations({
    boardId: boardId.toString(),
    options: { enabled: !params },
  });

  const { handleItemDragEnd: handleListDragEnd } = useItemDragHandler();
  const { handleItemDragEnd: handleTaskDragEnd } = useItemDragHandler();

  function handleDragStart({ active }: DragStartEvent) {
    if (active.data.current?.type === "column") {
      setDraggedColumn(active.data.current?.column);
      return;
    }

    if (active.data.current?.type === "task") {
      setDraggedTask(active.data.current?.task);
      return;
    }
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) {
      //active.id === over.id
      setDraggedColumn(null);
      setDraggedTask(null);
      return;
    }

    if (active.data.current?.type === "task") {
      handleTaskDrag(active, over);
    }

    if (active.data.current?.type === "column") {
      handleColumnDrag(active, over);
    }

    setDraggedColumn(null);
    setDraggedTask(null);

    return;
  }

  function handleTaskDrag(active: any, over: any) {
    if (typeof over.id === "string") {
      // if (active.data.current.task === over.data.current?.task) {
      //   //if (active.data.current.task.column_id !== over.data.current?.task.column_id) {
      //   // Moving task between columns
      // const updatedTask = {
      //   ...active.data.current?.task,
      //   column_id: parseInt(over.data.current?.task.column_id),
      // };

      //   // Update task
      //   moveTaskBetweenLists(updatedTask);
      //   return;
      // }

      let overId = parseInt(over.id.slice(1));

      if (active.data.current?.task.id === overId) {
        overId = lastTask?.id;
      }

      // Handle within-list task drag
      const { itemToUpdate, needsReordering } = handleTaskDragEnd(
        active.data.current?.task.id,
        overId,
        tasks,
        parseInt(active.data.current?.task.column_id.toString())
      );

      if (needsReordering) {
        mutateReorder.mutate(over.data.current?.task.column_id);
      } else if (itemToUpdate) {
        // Update task position
        moveTaskWithinList(
          itemToUpdate
          //updatedItems.sort((a, b) => a.position - b.position)
        );
      }
      return;
    } else {
      const columnTasks = tasks.filter((task) => task.column_id === parseInt(over.id.toString()));

      // Moving task to an empty column
      let updatedTask = {
        ...active.data.current?.task,
        column_id: parseInt(over.id.toString()),
      };

      if (columnTasks.length > 0) {
        const highestPosition = columnTasks.reduce((max, task) => Math.max(max, task.position), 0);

        updatedTask = {
          ...updatedTask,
          position: highestPosition + Ordering.BASE,
        };
      }

      // Update task
      moveTaskBetweenLists(updatedTask);
    }
  }

  function handleColumnDrag(active: any, over: any) {
    // Get updated lists
    const { updatedItems, itemToUpdate, needsReordering } = handleListDragEnd(
      active.data.current?.column.id,
      over.id,
      columns
    );

    // Update lists
    updateLists(updatedItems, itemToUpdate, needsReordering);
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "task";
    const isOverATask = over.data.current?.type === "task";

    if (isActiveTask && isOverATask) {
      setTimeout(() => {
        queryClient.setQueryData(
          ["tasks", boardId, { archived: showArchived }],
          (oldTasks: Task[]) => {
            const activeIndex = oldTasks.findIndex(
              (task) => task.id === parseInt(activeId.toString().replace("T", ""))
            );
            const overIndex = oldTasks.findIndex(
              (task) => task.id === parseInt(overId.toString().replace("T", ""))
            );

            if (oldTasks[activeIndex].column_id === oldTasks[overIndex].column_id) return;
            oldTasks[activeIndex].column_id = oldTasks[overIndex].column_id;
            oldTasks[activeIndex].position = Ordering.positionBetween(
              oldTasks[overIndex].position,
              oldTasks[overIndex + 1]?.position ||
                Ordering.positionAfter(oldTasks[overIndex].position)
            );

            setLastTask(oldTasks[overIndex]);
            setDraggedTask(oldTasks[activeIndex]);
            return arrayMove(oldTasks, activeIndex, overIndex);
          }
        );
      }, 50);
    }

    const isOverAColumn = over.data.current?.type === "column";

    if (isActiveTask && isOverAColumn) {
      setTimeout(() => {
        queryClient.setQueryData(
          ["tasks", boardId, { archived: showArchived }],
          (oldTasks: Task[]) => {
            const activeIndex = oldTasks.findIndex(
              (task) => task.id === parseInt(activeId.toString().replace("T", ""))
            );
            oldTasks[activeIndex].column_id = parseInt(overId.toString());

            setDraggedTask(oldTasks[activeIndex]);
            setLastTask(oldTasks[activeIndex]);
            // This is a hack to ensure that task can be moved in array
            // This task won't be rendered
            if (oldTasks.length === 1) {
              const task = {
                id: -1,
                name: "",
                priority: Priority.MEDIUM,
                position: 0,
                archived: showArchived,
                column_id: parseInt(overId.toString()),
                board_id: boardId,
              };
              oldTasks.push(task);
            }

            return arrayMove(oldTasks, activeIndex, activeIndex - 1);
          }
        );
      }, 50);
    }
  };

  return {
    draggedTask,
    draggedColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
  };
}
