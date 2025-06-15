import { useQuery } from "@tanstack/react-query";
import { BoardApi } from "@/api/boards";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { Input } from "@/components/ui/Form/Input";
import { keycloak } from "@/api/keycloak";
import { Icon } from "@iconify-icon/react";
import { Button, Skeleton } from "@/components/ui";
import { RemoveMember } from "@/features/boards/components/RemoveMember";
import { useState } from "react";

type BoardMembersProps = {
  boardId: string;
  onOpenChange?: (open: boolean) => void;
  triggerWrapper?: (triggerElement: React.ReactElement) => React.ReactElement;
};

export const MembersList = ({ boardId, onOpenChange, triggerWrapper }: BoardMembersProps) => {
  const [confirmModal, setConfirmModal] = useState(false);
  const membersItemWrapper = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  return (
    <Modal
      triggerButton={
        triggerWrapper ? (
          triggerWrapper(
            <>
              <Icon icon='material-symbols:person-outline' width='20' height='20' />
              Members
            </>
          )
        ) : (
          <Button variant='ghost' size='sm' fs='sm'>
            <Icon icon='material-symbols:person-outline' width='20' height='20' />
            Members
          </Button>
        )
      }
      disable={confirmModal}
      title='Members List'
      onOpenChange={onOpenChange}
    >
      <Form.Field label='Members'>
        <Input name='member' placeholder='Search member by email' />
      </Form.Field>
      <div style={membersItemWrapper as React.CSSProperties}>
        <Members boardId={boardId} openModal={setConfirmModal} />
      </div>
    </Modal>
  );
};

const Members = ({
  boardId,
  openModal,
}: {
  boardId: string;
  openModal: (open: boolean) => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["board", boardId, "members"],
    queryFn: async () => {
      return await BoardApi.getBoardMembers({
        boardId: boardId,
      });
    },
    staleTime: 1000,
  });

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
      <Skeleton.Group>
        <Skeleton width={32} height={32} variant='circle' />
        <Skeleton width={260} height={24} variant='rounded' />
      </Skeleton.Group>
    );
  }

  return data?.map((member) => (
    <div key={member.id} style={membersItem}>
      <div style={itemDetails}>
        {member.avatarUrl ? (
          <img src={member.avatarUrl} className='profile-img' />
        ) : (
          <div className='user-profile'>{keycloak.profile?.username?.charAt(0).toUpperCase()}</div>
        )}
        <span>{member.email}</span>
      </div>
      {keycloak.profile && member?.id != keycloak.profile.id && (
        <RemoveMember boardId={boardId} initialData={member} onOpenChange={openModal} />
      )}
    </div>
  ));
};
