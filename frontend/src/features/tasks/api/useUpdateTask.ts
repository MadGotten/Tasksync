import { TaskApi, TaskUpdateRequest } from "@/api/tasks";
import { Task } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTask = ({ boardId }: { boardId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: TaskUpdateRequest) => {
      return await TaskApi.updateTask(boardId, task.id, task);
    },
    onSuccess: (task: Task) => {
      queryClient.setQueryData(["tasks", boardId, { archived: false }], (oldData: Task[]) => {
        if (!oldData) return oldData;

        return oldData.map((t) => {
          if (t.id === task.id) {
            return { ...task };
          }
          return t;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["tasks", boardId, { archived: false }] });
    },
  });
};
