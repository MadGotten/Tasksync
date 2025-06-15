import { ListApi, ListRequest } from "@/api/lists";
import { List } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateList = ({ boardId, listId }: { boardId: number; listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (list: Partial<ListRequest>) => {
      return await ListApi.updatePartialList(boardId, listId, list);
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(["lists", boardId.toString()], (lists: List[]) => {
        return lists.map((list) => {
          return list.id === data.id ? data : list;
        });
      });
      //queryClient.invalidateQueries({ queryKey: ["lists", boardId] });
    },
  });
};
