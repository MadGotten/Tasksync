import { memo, useCallback, useState } from "react";
import { EditColumn } from "../EditColumn";
import { List } from "@/types/api";
import { useRemoveList } from "@/features/lists/api/useRemoveList";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { Icon } from "@iconify-icon/react";
import { IconButton } from "@/components/ui";

const DropdownList = memo(({ boardId, column }: { boardId: number; column: List }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const mutation = useRemoveList({ boardId: boardId, listId: column.id });

  const handleModalOpen = useCallback((open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setDropdownOpen(false);
    }
  }, []);

  const handleRemoveList = useCallback(() => {
    mutation.mutate();
    setDropdownOpen(false);
  }, [mutation]);

  return (
    <Dropdown
      onOpenChange={setDropdownOpen}
      dropdownOpen={dropdownOpen}
      triggerButton={
        <IconButton icon='solar:menu-dots-bold' iconSize={24} size='icon' variant='ghost' />
      }
      hidden={modalOpen}
    >
      <Dropdown.Option asChild>
        <EditColumn boardId={boardId} initialData={column} onOpenChange={handleModalOpen} />
      </Dropdown.Option>
      <Dropdown.Option onClick={handleRemoveList} variant='danger'>
        <>
          <Icon icon='lucide:delete' width={20} height={20}></Icon>
          Delete
        </>
      </Dropdown.Option>
    </Dropdown>
  );
});

export default DropdownList;
