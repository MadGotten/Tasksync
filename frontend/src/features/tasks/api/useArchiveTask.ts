import { TaskApi } from "@/api/tasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useArchiveTask = ({ boardId }: { boardId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, archived }: { taskId: number; archived: boolean }) => {
      //return await TaskApi.updatePartialTask(boardId, taskId, { archived });
      return await TaskApi.archiveTask(boardId, taskId, { archived });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId] });
    },
  });
};
