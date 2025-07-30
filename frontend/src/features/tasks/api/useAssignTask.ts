import { TaskApi } from "@/api/tasks";
import { Task } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAssignTask = ({ boardId }: { boardId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      return await TaskApi.assignTask(boardId, taskId);
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(["tasks", boardId], (oldTasks?: Task[]) => {
        if (!oldTasks) return [updatedTask];
        return oldTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
    },
  });
};
