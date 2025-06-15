import { TaskApi } from "@/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReorderTasks = ({ boardId }: { boardId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => {
      return TaskApi.reorderTasks(boardId, listId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId, { archived: false }] });
    },
  });
};
