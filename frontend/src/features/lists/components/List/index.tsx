import { useMemo, memo, useState, useCallback } from "react";
import { SortableContext } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { Task } from "@/features/tasks/components/Task";
import styles from "./List.module.css";
import { CSS } from "@dnd-kit/utilities";
import { Task as TaskEntity, List as ListEntity } from "@/types/api";
import { isEqual } from "lodash";
import { CreateTask } from "@/features/tasks/components/CreateTask";
import DropdownList from "@/features/lists/components/List/DropdownList";
import { isAuthorized } from "@/utils/permissions";
import { Role } from "@/types/enums";
import { Authorized } from "@/components/Authorized";

type ListProps = {
  column: ListEntity;
  tasks: TaskEntity[];
  memberRole: "ADMIN" | "MEMBER" | "GUEST";
  isDragged?: boolean;
};

export const List: React.FC<ListProps> = memo(
  ({ column, memberRole, tasks, isDragged = false }) => {
    const [allowScroll, setAllowScroll] = useState(false);

    const tasksId = useMemo(() => {
      return tasks.map((task) => "T" + task.id);
    }, [tasks]);

    const handleScroll = useCallback(() => {
      setAllowScroll((prev) => !prev);
    }, []);

    const {
      attributes,
      listeners,
      active,
      setDraggableNodeRef,
      isDragging,
      transform,
      transition,
      node,
      setDroppableNodeRef,
      setNodeRef,
    } = useSortable({
      id: column.id,
      data: {
        type: "column",
        column,
      },
    });
    const isColumnDragged = active?.data.current?.type === "column";

    const style: React.CSSProperties = {
      transition,
      transform: CSS.Transform.toString(transform),
      cursor: isDragged ? "grab" : "default",
    };

    if (isDragging) {
      const height = node.current?.children[0]?.clientHeight;
      style.height = `${height}px`;
      return <div ref={setNodeRef} style={style} className={styles["container-overlay"]}></div>;
    }

    return (
      <>
        <div ref={setDroppableNodeRef} className={styles.container}>
          <div
            ref={setDraggableNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className={styles.overlay}
          >
            <div className={styles.list}>
              <div className={styles.header}>
                <p className={styles.title}>{column.name}</p>
                <Authorized boardId={column.board_id.toString()} role='MEMBER'>
                  <DropdownList boardId={column.board_id} column={column} />
                </Authorized>
              </div>
              <div className={`${styles.scrollable} ${allowScroll && styles.disableScroll}`}>
                <SortableContext
                  disabled={isColumnDragged || !isAuthorized(memberRole, Role.MEMBER)}
                  items={tasksId}
                >
                  {tasks.length > 0 &&
                    tasks.map(
                      (task) =>
                        task.id !== -1 && (
                          <Task
                            key={task.id}
                            task={task}
                            memberRole={memberRole}
                            boardId={column.board_id}
                            disableScroll={handleScroll}
                          />
                        )
                    )}
                </SortableContext>
              </div>

              <Authorized boardId={column.board_id.toString()} role='MEMBER'>
                <div className={styles.footer}>
                  <CreateTask column={column} />
                </div>
              </Authorized>
            </div>
          </div>
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.column.id === nextProps.column.id &&
      prevProps.column.name === nextProps.column.name &&
      prevProps.isDragged === nextProps.isDragged &&
      isEqual(prevProps.tasks, nextProps.tasks)
    );
  }
);
