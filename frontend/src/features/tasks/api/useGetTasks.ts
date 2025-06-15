import { TaskApi } from "@/api/tasks";
import { useQuery } from "@tanstack/react-query";
import { Options, Task } from "@/types/api";

export const useGetTasks = ({
  boardId,
  showArchived,
  options,
}: {
  boardId: number;
  showArchived: boolean;
  options?: Options<Task[]>;
}) => {
  return useQuery({
    queryKey: ["tasks", boardId, { archived: showArchived }],
    queryFn: async () => {
      return await TaskApi.getAllTasksByBoard({
        boardId: boardId,
        archived: showArchived ? true : false,
      });
    },
    ...options,
  });
};
