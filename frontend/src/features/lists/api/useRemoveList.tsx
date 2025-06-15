import { ListApi } from "@/api/lists";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRemoveList = ({ boardId, listId }: { boardId: number; listId: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await ListApi.deleteList(boardId, listId);
    },
    onSuccess: () => {
      queryClient.setQueryData(["lists", boardId.toString()], (oldData: any) => {
        return oldData?.filter((list: any) => list.id !== listId);
      });
      queryClient.invalidateQueries({ queryKey: ["lists", boardId.toString()] });
    },
  });
};
