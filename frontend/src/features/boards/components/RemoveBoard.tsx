import { Button } from "@/components/ui";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { useRemoveBoard } from "@/features/boards/api/useRemoveBoard";
import { Icon } from "@iconify-icon/react";

export const RemoveBoard = ({
  boardId,
  initialData,
  onOpenChange,
  triggerWrapper,
}: {
  boardId: any;
  initialData: any;
  onOpenChange?: (open: boolean) => void;
  triggerWrapper?: (triggerElement: React.ReactElement) => React.ReactElement;
}) => {
  const { mutate, isSuccess, isPending } = useRemoveBoard({ boardId });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <Modal
      triggerButton={
        triggerWrapper ? (
          triggerWrapper(
            <>
              <Icon icon='lucide:delete' width={20} height={20} />
              Delete
            </>
          )
        ) : (
          <Button variant='ghost' size='sm' fs='sm'>
            <Icon icon='lucide:delete' width={20} height={20} />
            Delete
          </Button>
        )
      }
      onOpenChange={(open) => {
        if (onOpenChange) {
          onOpenChange(open);
        }
      }}
      isDone={isSuccess}
      title='Delete Board'
      onSubmit={handleSubmit}
    >
      {({ close }) => (
        <>
          <p className='helper-text'>
            Are you sure you want to delete the board <strong>{initialData.name}</strong>?<br />
            This action cannot be undone.
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
