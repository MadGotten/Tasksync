import { Priority } from "@/types/enums";
import { Button, IconButton } from "@/components/ui";
import { useCreateTask } from "@/features/tasks/api/useCreateTask";
import { useQueryClient } from "@tanstack/react-query";
import { TaskRequest } from "@/api/tasks";
import { Task } from "@/types/api";
import { Modal } from "@/components/ui/Form/Modal";
import Form from "@/components/ui/Form/Form";
import { Input } from "@/components/ui/Form/Input";
import { memo } from "react";

export const CreateTask = memo(({ column }: { column: any }) => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateCreateTask,
    isSuccess,
    isPending,
    reset,
  } = useCreateTask({
    listId: column.id,
    boardId: column.board_id,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    createTask(formData);
  };

  const createTask = (formData: FormData) => {
    let position = 16384;

    const tasks = (queryClient.getQueryData(["tasks", parseInt(column.board_id)]) as Task[]) || [];

    if (tasks.length > 0) {
      const filteredTasks = tasks
        .filter((task) => task.column_id === column.id && task)
        .sort((a, b) => a.position - b.position);
      if (filteredTasks.length > 0) {
        position = filteredTasks[filteredTasks.length - 1].position + 16384;
      }
    }

    const taskData: TaskRequest = {
      name: formData.get("name")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      priority: formData.get("priority")?.toString() as Priority,
      position,
      archived: false,
    };

    mutateCreateTask(taskData);
  };

  return (
    <Modal
      triggerButton={
        <IconButton
          variant='ghost'
          size='sm'
          fs='sm'
          full
          icon='material-symbols:add'
          iconSize={20}
          className='button--left'
        >
          Create Task
        </IconButton>
      }
      isDone={isSuccess}
      title='Add'
      onSubmit={handleSubmit}
      onOpenChange={reset}
    >
      <Form.Field label='Name'>
        <Input name='name' placeholder='Enter task name' autoFocus />
      </Form.Field>
      <Form.Field label='Description'>
        <Input name='description' placeholder='Enter description' />
      </Form.Field>
      <Form.Field label='Priority'>
        <select name='priority' id='priority-id'>
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
          Create
        </Button>
      </Form.Actions>
    </Modal>
  );
});
