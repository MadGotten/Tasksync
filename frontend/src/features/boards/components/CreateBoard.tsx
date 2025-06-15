import "@/components/ui/Form/Form.css";
import { Button, IconButton } from "@/components/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BoardApi } from "@/api/boards";
import { Board } from "@/types/api";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { Input } from "@/components/ui/Form/Input";

export const CreateBoard = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: BoardApi.addBoard,
    onSuccess: (data) => {
      queryClient.setQueryData(["boards"], (boards: Board[]) => [...boards, data]);
    },
  });

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (!formData.get("name")) {
      return;
    }
    mutation.mutate({ name: formData.get("name") as string });
  };

  return (
    <Modal
      triggerButton={
        <IconButton icon='material-symbols:add' iconSize={20} variant='primary' size='sm' fs='sm'>
          Add
        </IconButton>
      }
      isDone={mutation.isSuccess}
      title='Create Board'
      onSubmit={handleFormSubmit}
    >
      <Form.Field label='Board name'>
        <Input name='name' placeholder='Enter board name' autoFocus />
      </Form.Field>
      <Form.Actions>
        <Button type='submit' variant='primary' full={true} size='lg' fs='sm'>
          Create
        </Button>
      </Form.Actions>
    </Modal>
  );
};
