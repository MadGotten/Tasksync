import { TaskApi } from "@/api/tasks";
import { Task } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

export const useMoveTaskBetweenList = ({ boardId }: { boardId: number }) => {
  return useMutation({
    mutationFn: async (task: Task) => {
      return await TaskApi.updatePartialTask(boardId, task.id, {
        column_id: task.column_id,
        position: task.position,
      });
    },
  });
};
