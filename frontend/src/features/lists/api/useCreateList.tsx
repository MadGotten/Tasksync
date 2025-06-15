import { ListApi, ListRequest } from "@/api/lists";
import { List } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateList = ({ boardId }: { boardId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (list: ListRequest) => {
      return ListApi.addList(boardId, list);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["lists", boardId], (old: List[]) => {
        return [...old, data];
      });
    },
  });
};
