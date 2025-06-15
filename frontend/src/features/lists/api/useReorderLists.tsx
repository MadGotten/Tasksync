import { ListApi } from "@/api/lists";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useReorderLists = ({ boardId }: { boardId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return ListApi.reorderList(boardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
};
