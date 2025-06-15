import { TaskApi, TaskRequest } from "@/api/tasks";
import { Task } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTask = ({ listId, boardId }: { listId: number; boardId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: TaskRequest) => {
      return TaskApi.addTask(boardId, listId, task);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["tasks", boardId, { archived: false }], (oldTasks: Task[]) => {
        return [...oldTasks, data];
      });
    },
  });
};
