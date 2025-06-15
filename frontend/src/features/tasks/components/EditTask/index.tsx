import { Priority } from "@/types/enums";
import { Button } from "@/components/ui";
import { useUpdateTask } from "@/features/tasks/api/useUpdateTask";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { Input } from "@/components/ui/Form/Input";
import { Icon } from "@iconify-icon/react";

export const EditTask = ({
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
  const { mutate: mutateUpdateTask, isSuccess, isPending } = useUpdateTask({ boardId });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    handleEditTask(formData);
  };

  const handleEditTask = (formData: FormData) => {
    mutateUpdateTask({
      id: initialData.id,
      name: formData.get("name")?.toString() || initialData.name,
      description: formData.get("description")?.toString() || "",
      priority: (formData.get("priority") as Priority) || initialData.priority,
      position: initialData.position,
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
      onOpenChange={onOpenChange}
      isDone={isSuccess}
      title='Edit'
      onSubmit={handleSubmit}
    >
      <Form.Field label='Name'>
        <Input
          name='name'
          placeholder='Enter task name'
          defaultValue={initialData?.name || ""}
          autoFocus
        />
      </Form.Field>
      <Form.Field label='Description'>
        <Input
          name='description'
          placeholder='Enter description'
          defaultValue={initialData?.description || ""}
        />
      </Form.Field>
      <Form.Field label='Priority'>
        <select name='priority' id='priority-id' defaultValue={initialData?.priority || ""}>
          <option value='HIGH'>High</option>
          <option value='MEDIUM'>Medium</option>
          <option value='LOW'>Low</option>
        </select>
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
