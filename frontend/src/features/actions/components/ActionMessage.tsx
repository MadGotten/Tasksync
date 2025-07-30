import { Action } from "@/types/api";
import { Link } from "@tanstack/react-router";

const TaskCreatedMessage = ({ action }: { action: Action }) => {
  return (
    <>
      User {action.user.email} created task{" "}
      <Link
        className='link'
        to={"/board/$boardId/tasks/$taskId"}
        params={{ boardId: action.board.id, taskId: action.task.id }}
      >
        {action.task.name}
      </Link>
    </>
  );
};

const TaskUpdatedMessage = ({ action }: { action: Action }) => {
  return (
    <>
      User {action.user.email} updated task{" "}
      <Link
        className='link'
        to={"/board/$boardId/tasks/$taskId"}
        params={{ boardId: action.board.id, taskId: action.task.id }}
      >
        {action.task.name}
      </Link>
    </>
  );
};

const TaskMovedMessage = ({ action }: { action: Action }) => {
  return (
    <>
      User {action.user.email} moved task{" "}
      <Link
        className='link'
        to={"/board/$boardId/tasks/$taskId"}
        params={{ boardId: action.board.id, taskId: action.task.id }}
      >
        {action.task.name}
      </Link>
    </>
  );
};

const TaskArchivedMessage = ({ action }: { action: Action }) => {
  return (
    <>
      User {action.user.email} archived task{" "}
      <Link
        className='link'
        to={"/board/$boardId/tasks/$taskId"}
        params={{ boardId: action.board.id, taskId: action.task.id }}
      >
        {action.task.name}
      </Link>
    </>
  );
};

const BoardCreatedMessage = ({ action }: { action: Action }) => {
  return `User ${action.user.email}  created board ${action.board.name}`;
};

const BoardUpdatedMessage = ({ action }: { action: Action }) => {
  return `User ${action.user.email}  created board ${action.board.name}`;
};

const BoardInvitedMemberMessage = ({ action }: { action: Action }) => {
  return `User ${action.user.email}  has been invited to board ${action.board.name}`;
};

const BoardRemovedMemberMessage = ({ action }: { action: Action }) => {
  return `User ${action.user.email}  has been removed from board ${action.board.name}`;
};

const actionTypeComponent: Record<string, (action: Action) => React.ReactNode> = {
  TASK_CREATED: (action) => <TaskCreatedMessage action={action} />,
  TASK_UPDATED: (action) => <TaskUpdatedMessage action={action} />,
  TASK_MOVED: (action) => <TaskMovedMessage action={action} />,
  TASK_ARCHIVED: (action) => <TaskArchivedMessage action={action} />,
  BOARD_CREATED: (action) => <BoardCreatedMessage action={action} />,
  BOARD_UPDATED: (action) => <BoardUpdatedMessage action={action} />,
  BOARD_INVITED: (action) => <BoardInvitedMemberMessage action={action} />,
  BOARD_REMOVED: (action) => <BoardRemovedMemberMessage action={action} />,
};

export const ActionMessage = ({ action }: { action: Action }) => {
  // return <span>{formatActionType(action.type, action.user.email, action.task, action.board)}</span>;
  const render = actionTypeComponent[action.type];
  return <span>{render ? render(action) : `Unknown action type: ${action.type}`}</span>;
};
