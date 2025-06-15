import { List, Options } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMoveList } from "@/features/lists/api/useMoveList";
import { useGetLists } from "@/features/lists/api/useGetLists";
import { useReorderLists } from "@/features/lists/api/useReorderLists";

export function useListOperations({
  boardId,
  options,
}: {
  boardId: string;
  options?: Options<List[]>;
}) {
  const queryClient = useQueryClient();
  const { data: lists } = useGetLists({ boardId, options });
  const { mutate: mutateMoveList } = useMoveList({ boardId });
  const { mutate: mutateReorderLists } = useReorderLists({ boardId });

  const updateLists = (
    updatedLists: List[],
    listToUpdate: List | null,
    needsReordering: boolean
  ) => {
    if (needsReordering) {
      // Send reorder mutation
      mutateReorderLists();
    } else if (listToUpdate) {
      // Send update for single list
      mutateMoveList({
        id: listToUpdate.id,
        position: listToUpdate.position,
        name: listToUpdate.name,
        board_id: parseInt(boardId),
      });
      queryClient.setQueryData(["lists", boardId], updatedLists);
    }
  };

  return {
    lists,
    updateLists,
  };
}
