import { TaskApi } from "@/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveTask = ({ boardId }: { boardId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: number) => {
      return await TaskApi.deleteTask(boardId, taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId, { archived: false }] });
    },
  });
};
