import { ListApi } from "@/api/lists";
import { List } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMoveList = ({ boardId }: { boardId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (list: List) => {
      return ListApi.updatePartialList(boardId, list.id.toString(), list);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["lists", boardId] });
      const previousLists = queryClient.getQueryData<List[]>(["lists", boardId]);

      return { previousLists };
    },
    onError: (context: { previousLists: List[] }) => {
      queryClient.setQueryData(["lists", boardId], context?.previousLists);
    },
    onSuccess: (list: List) => {
      console.log(list);
      queryClient.setQueryData<List[]>(["lists", boardId], (oldLists) => {
        if (!oldLists) return oldLists;

        const updatedLists = oldLists.map((l) =>
          l.id === list.id ? { ...l, position: list.position } : l
        );

        return updatedLists.sort((a, b) => a.position - b.position);
      });
    },
  });
};
