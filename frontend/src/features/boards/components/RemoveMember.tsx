import { Button, IconButton } from "@/components/ui";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoardApi } from "@/api/boards";

export const RemoveMember = ({
  boardId,
  initialData,
  onOpenChange,
}: {
  boardId: any;
  initialData: any;
  onOpenChange?: (open: boolean) => void;
  triggerWrapper?: (triggerElement: React.ReactElement) => React.ReactElement;
}) => {
  const queryClient = useQueryClient();

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: async (memberId: string) => {
      return await BoardApi.deleteBoardMember({
        boardId: boardId,
        memberId: memberId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["board", boardId, "members"] });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(initialData.id);
  };

  return (
    <Modal
      triggerButton={<IconButton variant='ghost' size='icon' icon='material-symbols:close' />}
      isDone={isSuccess}
      title='Remove Member'
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    >
      {({ close }) => (
        <>
          <p className='helper-text'>
            Are you sure you want to remove member from the board This action cannot be undone.
          </p>
          <Form.Actions>
            <Button type='button' variant='primary' size='lg' fs='sm' onClick={close}>
              No
            </Button>
            <Button
              type='submit'
              variant='danger'
              size='lg'
              fs='sm'
              isLoading={isPending || isSuccess}
            >
              Yes
            </Button>
          </Form.Actions>
        </>
      )}
    </Modal>
  );
};
