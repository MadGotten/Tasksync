import { ListApi } from "@/api/lists";
import { List, Options } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useGetLists = ({
  boardId,
  options,
}: {
  boardId: string;
  options?: Options<List[]>;
}) => {
  return useQuery({
    queryKey: ["lists", boardId],
    queryFn: () => ListApi.getAllLists(boardId),
    staleTime: 30000,
    enabled: !!boardId,
    ...options,
  });
};
