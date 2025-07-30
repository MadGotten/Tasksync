import { useState, memo, useCallback } from "react";
import { Task as TaskEntity } from "@/types/api";
import { useRemoveTask } from "@/features/tasks/api/useRemoveTask";
import { useArchiveTask } from "@/features/tasks/api/useArchiveTask";
import { useAssignTask } from "@/features/tasks/api/useAssignTask";
import { EditTask } from "@/features/tasks/components/EditTask";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { IconButton } from "@/components/ui";
import { Icon } from "@iconify-icon/react";

const DropdownTask = memo(
  ({
    boardId,
    task,
    disableScroll,
  }: {
    boardId: number;
    task: TaskEntity;
    disableScroll?: VoidFunction;
  }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const handleModalOpen = useCallback((open: boolean) => {
      setModalOpen(open);
      if (!open) {
        setDropdownOpen(false);
      }
    }, []);

    const { mutate: mutateRemoveTask } = useRemoveTask({ boardId: boardId });
    const { mutate: mutateArchiveTask } = useArchiveTask({ boardId: boardId });
    const { mutate: mutateAssignTask } = useAssignTask({ boardId: boardId });

    const toggleSettings = (open: boolean) => {
      setDropdownOpen(open);
      if (disableScroll) {
        disableScroll();
      }
    };

    const handleDeleteClick = () => {
      mutateRemoveTask(task.id);
      setDropdownOpen(false);
    };

    const handleArchiveClick = () => {
      mutateArchiveTask({ taskId: task.id, archived: !task.archived });
      setDropdownOpen(false);
    };

    const handleAssignClick = () => {
      mutateAssignTask(task.id);
      setDropdownOpen(false);
    };

    return (
      <Dropdown
        onOpenChange={toggleSettings}
        dropdownOpen={dropdownOpen}
        triggerButton={
          <IconButton icon='solar:menu-dots-bold' iconSize={24} size='icon' variant='ghost' />
        }
        hidden={modalOpen}
      >
        <Dropdown.Option asChild>
          <EditTask boardId={boardId} initialData={task} onOpenChange={handleModalOpen} />
        </Dropdown.Option>
        <Dropdown.Option onClick={handleAssignClick}>
          <>
            <Icon icon='lucide:circle-chevron-left' width={20} height={20} />
            Assign
          </>
        </Dropdown.Option>
        <Dropdown.Option onClick={handleArchiveClick}>
          <>
            <Icon icon='solar:archive-linear' width={20} height={20} />
            {task.archived ? "Unarchive" : "Archive"}
          </>
        </Dropdown.Option>
        <Dropdown.Option onClick={handleDeleteClick} variant='danger'>
          <>
            <Icon icon='lucide:delete' width={20} height={20} />
            Delete
          </>
        </Dropdown.Option>
      </Dropdown>
    );
  }
);

export default DropdownTask;
