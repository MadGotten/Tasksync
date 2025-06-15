import { IconButton, Skeleton } from "@/components/ui";
import Form from "@/components/ui/Form/Form";
import "@/components/ui/Form/Form.css";
import styles from "./TaskDetails.module.css";
import { useGetActionTask } from "@/features/actions/api/useGetActionTask";
import { useUpdateTask } from "../../api/useUpdateTask";
import { Task } from "@/types/api";
import { useState } from "react";
import { isAuthorized } from "@/utils/permissions";
import { useGetPermission } from "@/features/boards/api/useGetPermission";
import { Role } from "@/types/enums";
import { ActionMessage } from "@/features/actions/components/ActionMessage";

export const TaskDetails = ({ onClose, task }: { onClose: VoidFunction; task: Task }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const { data: member_role, isLoading } = useGetPermission({ boardId: task.board_id.toString() });

  const mutate = useUpdateTask({ boardId: task.board_id });

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === task.description) return;
    task.description = e.target.value;
    mutate.mutate(task);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleEditingTitle();
    if (e.target.value.length <= 0 || e.target.value === task.name) return;
    task.name = e.target.value;
    mutate.mutate(task);
  };

  const toggleEditingTitle = () => {
    if (!member_role || !isAuthorized(member_role, Role.MEMBER)) return;
    setIsEditingTitle((prev) => !prev);
  };

  if (isLoading) {
    return;
  }

  return (
    <>
      <div className='overlay' onClick={onClose}></div>
      <div className={`modal ${styles.taskModal}`}>
        <div className='modal-header'>
          {isEditingTitle ? (
            <div className='modal-title'>
              <input
                name='title'
                className={styles.headlessInput}
                defaultValue={task?.name || ""}
                autoFocus
                spellCheck='false'
                autoComplete='off'
                onBlur={handleTitleChange}
              />
            </div>
          ) : (
            <div className='modal-title' onClick={toggleEditingTitle}>
              {task.name}
            </div>
          )}

          <IconButton
            className='modal-close'
            variant='ghost'
            size='icon'
            icon='material-symbols:close'
            onClick={onClose}
          />
        </div>
        <form className={`form-group ${styles.modalPadding}`}>
          <Form.Field label='Description'>
            <textarea
              rows={3}
              name='description'
              placeholder='Enter description'
              className={styles.descriptionInput}
              defaultValue={task?.description || ""}
              disabled={!member_role || !isAuthorized(member_role, Role.MEMBER)}
              spellCheck='false'
              onBlur={handleDescriptionChange}
            />
          </Form.Field>
          <div className={styles.actionList}>
            <p className={styles.actionName}>Activity</p>
            <Action taskId={task.id.toString()} />
          </div>
        </form>
      </div>
    </>
  );
};

const Action = ({ taskId }: { taskId: string }) => {
  const { data, isLoading } = useGetActionTask({ taskId });

  const membersItem = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  };

  const itemDetails = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  if (isLoading) {
    return (
      <Skeleton.Group direction='column' gap={16}>
        <Skeleton.Group>
          <Skeleton width={32} height={32} variant='circle' />
          <Skeleton width={260} height={28} variant='rounded' />
        </Skeleton.Group>
        <Skeleton.Group>
          <Skeleton width={32} height={32} variant='circle' />
          <Skeleton width={140} height={28} variant='rounded' />
        </Skeleton.Group>
        <Skeleton.Group>
          <Skeleton width={32} height={32} variant='circle' />
          <Skeleton width={190} height={28} variant='rounded' />
        </Skeleton.Group>
      </Skeleton.Group>
    );
  }

  return data?.pages.map((page) => (
    <div key={page.page.number}>
      {page.content?.map((action) => (
        <div key={action.id} style={membersItem}>
          <div style={itemDetails}>
            {action.user.avatarUrl ? (
              <img src={action.user.avatarUrl} className='profile-img' />
            ) : (
              <div className='user-profile'>{action.user.email?.charAt(0).toUpperCase()}</div>
            )}
            <div className={styles.actionType}>
              <ActionMessage action={action} />
            </div>
          </div>
        </div>
      ))}
    </div>
  ));
};
