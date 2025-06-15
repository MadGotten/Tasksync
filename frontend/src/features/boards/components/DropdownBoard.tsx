import { IconButton } from "@/components/ui";
import { MemberInvite } from "@/features/boards/components/MemberInvite";
import { MembersList } from "@/features/boards/components/MembersList";
import { EditBoard } from "@/features/boards/components/EditBoard";
import { memo, useCallback, useState } from "react";
import { ActionBoardList } from "@/features/actions/components/ActionBoardList";
import { useLoaderData } from "@tanstack/react-router";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { RemoveBoard } from "@/features/boards/components/RemoveBoard";
import { Authorized } from "@/components/Authorized";

type BoardActionsProps = {
  boardId: string;
};

export const DropdownBoard = memo(({ boardId }: BoardActionsProps) => {
  const board = useLoaderData({ from: "/_authenticated/board/$boardId" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = useCallback((open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setDropdownOpen(false);
    }
  }, []);

  return (
    <Dropdown
      onOpenChange={setDropdownOpen}
      dropdownOpen={dropdownOpen}
      triggerButton={
        <IconButton icon='solar:menu-dots-bold' iconSize={24} size='sm' variant='ghost' />
      }
      hidden={modalOpen}
      orientation='left'
      topOffset={8}
    >
      <Authorized boardId={boardId} role='ADMIN'>
        <Dropdown.Option asChild>
          <MemberInvite boardId={boardId} onOpenChange={handleModalOpen} />
        </Dropdown.Option>
        <Dropdown.Option asChild>
          <EditBoard boardId={boardId} onOpenChange={handleModalOpen} modalOpen={modalOpen} />
        </Dropdown.Option>
        <Dropdown.Option asChild>
          <MembersList boardId={boardId} onOpenChange={handleModalOpen} />
        </Dropdown.Option>
      </Authorized>
      <Dropdown.Option asChild>
        <ActionBoardList boardId={boardId} onOpenChange={handleModalOpen} />
      </Dropdown.Option>
      <Authorized boardId={boardId} role='ADMIN'>
        <Dropdown.Option variant='danger' asChild>
          <RemoveBoard boardId={boardId} initialData={board} onOpenChange={handleModalOpen} />
        </Dropdown.Option>
      </Authorized>
    </Dropdown>
  );
});
