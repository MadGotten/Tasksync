import { Button } from "@/components/ui";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { Input } from "@/components/ui/Form/Input";
import { useUpdateList } from "@/features/lists/api/useUpdateList";
import { Icon } from "@iconify-icon/react";

export const EditColumn = ({
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
  const { mutate, isSuccess, isPending, reset } = useUpdateList({
    boardId,
    listId: initialData.id,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    mutate({
      name: formData.get("name")?.toString() || initialData.name,
    });
  };

  return (
    <Modal
      triggerButton={
        triggerWrapper ? (
          triggerWrapper(
            <>
              <Icon icon='lucide:edit' width='20' height='20' />
              Edit
            </>
          )
        ) : (
          <Button variant='ghost' size='sm' fs='sm'>
            <Icon icon='lucide:edit' width='20' height='20' />
            Edit
          </Button>
        )
      }
      onOpenChange={(open) => {
        reset();
        if (onOpenChange) {
          onOpenChange(open);
        }
      }}
      isDone={isSuccess}
      title='Edit'
      onSubmit={handleSubmit}
    >
      <Form.Field label='Name'>
        <Input
          name='name'
          placeholder='Enter column name'
          defaultValue={initialData?.name || ""}
          autoFocus
        />
      </Form.Field>
      <Form.Actions>
        <Button
          type='submit'
          variant='primary'
          full
          size='lg'
          fs='sm'
          isLoading={isPending || isSuccess}
        >
          Edit
        </Button>
      </Form.Actions>
    </Modal>
  );
};
