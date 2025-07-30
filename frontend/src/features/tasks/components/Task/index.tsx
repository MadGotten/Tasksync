import { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@tanstack/react-router";
import "./Task.css";
import { TaskExpanded, User } from "@/types/api";
import DropdownTask from "@/features/tasks/components/Task/DropdownTask";
import { isAuthorized } from "@/utils/permissions";
import { Role } from "@/types/enums";
import { Authorized } from "@/components/Authorized";

enum Colors {
  LOW = "green",
  MEDIUM = "orange",
  HIGH = "red",
}

type TaskProps = {
  isDragged?: boolean;
  task: TaskExpanded;
  memberRole: "ADMIN" | "MEMBER" | "GUEST";
  boardId: number;
  disableScroll?: VoidFunction;
};

export const Task: React.FC<TaskProps> = memo(
  ({ isDragged = false, task, boardId, disableScroll, memberRole }) => {
    const { setNodeRef, attributes, listeners, isDragging, transition, transform, active } =
      useSortable({
        id: "T" + task.id,
        data: { task, type: "task" },
      });

    const isDraggingTask = active?.data.current?.type === "task";

    const color = Colors[task.priority];
    const style: React.CSSProperties = {
      transition:
        isDraggingTask && active?.data.current?.task.column_id === task.column_id ? transition : "", // Shitty hack to prevent scrollbar flickering when dragging over columns
      transform: isDragged ? "rotate(-4deg) " : CSS.Transform.toString(transform),
      cursor: isDragged ? "grab" : "default",
      border: isDragging ? "1px red solid" : "",
    };

    if (isDragging) {
      return <div ref={setNodeRef} style={style} className='task task-overlay'></div>;
    }

    return (
      <>
        <div
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          className='task'
          style={style}
          data-authorized={isAuthorized(memberRole, Role.MEMBER)}
        >
          <Link
            to={"/board/$boardId/tasks/$taskId"}
            params={{ taskId: task.id.toString(), boardId: boardId.toString() }}
            className='task-content-wrapper'
            data-archived={task.archived}
          >
            <div className='task-content'>
              <p className='task-name'>{task.name}</p>
              <p className='task-description'>{task.description}</p>
            </div>
            <div className='task-options'>
              <span className='task-priority' style={{ backgroundColor: color }} />
            </div>
            <div className='task-assignee'>
              <TaskAssignee assignees={task.assignees} />
            </div>
          </Link>
          <Authorized boardId={boardId.toString()} role='MEMBER'>
            <div className='task-settings'>
              <DropdownTask boardId={boardId} task={task} disableScroll={disableScroll} />
            </div>
          </Authorized>
        </div>
      </>
    );
  }
);

const TaskAssignee = ({ assignees }: { assignees: User[] }) => {
  const maxVisibleAssignees = 4;
  const visibleAssignees = assignees.slice(0, maxVisibleAssignees);
  const remainingCount = assignees.length - maxVisibleAssignees;

  return (
    <>
      {remainingCount > 0 && <div className='task-assignee__count'>+{remainingCount}</div>}

      {visibleAssignees.map((assignee, index) => (
        <img
          src={assignee.avatarUrl}
          className='task-assignee__avatar'
          key={assignee.id}
          style={{ zIndex: assignees.length + index }}
        />
      ))}
    </>
  );
};
