import { BoardApi } from "@/api/boards";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export const useRemoveBoard = ({ boardId }: { boardId: string }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      return await BoardApi.deleteBoard(boardId);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["boards", boardId] });
      queryClient.setQueryData(["boards"], (oldData: any) => {
        console.log(oldData);
        return oldData?.filter((board: any) => board.id !== parseInt(boardId));
      });
      navigate({ to: "/board" });
    },
  });
};
