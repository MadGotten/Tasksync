import { useQueryClient } from "@tanstack/react-query";
import { useCreateList } from "@/features/lists/api/useCreateList";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { Input } from "@/components/ui/Form/Input";
import { Ordering } from "@/utils/ordering";
import { Button, IconButton } from "@/components/ui";

export const CreateColumn = ({ boardId }: { boardId: string }) => {
  const mutation = useCreateList({ boardId });
  const queryClient = useQueryClient();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let position = Ordering.BASE;

    const lists = queryClient.getQueryData(["lists", boardId]);

    if (lists) {
      const listsData = lists as { id: string; position: number }[];
      const sortedLists = listsData.sort((a, b) => a.position - b.position);
      const lastList = sortedLists[sortedLists.length - 1];
      if (lastList) {
        position = lastList.position + Ordering.BASE;
      }
    }

    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get("name") as string,
      position: position,
    };

    mutation.mutate(data);
  };

  return (
    <Modal
      triggerButton={
        <IconButton icon='material-symbols:add' iconSize={20} variant='primary' size='sm' fs='sm'>
          Add
        </IconButton>
      }
      title='Create Column'
      isDone={mutation.isSuccess}
      onSubmit={handleFormSubmit}
    >
      <Form.Field label='Column name'>
        <Input name='name' placeholder='Enter column name' autoFocus />
      </Form.Field>
      <Form.Actions>
        <Button type='submit' variant='primary' full size='lg' fs='sm'>
          Create
        </Button>
      </Form.Actions>
    </Modal>
  );
};
