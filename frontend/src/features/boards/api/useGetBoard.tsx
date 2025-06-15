import { BoardApi } from "@/api/boards";
import { keycloak } from "@/api/keycloak";
import { BoardMemberRole, Options } from "@/types/api";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getBoardQueryOptions = (boardId: string, options?: Options<BoardMemberRole>) =>
  queryOptions({
    queryKey: ["boards", boardId],
    queryFn: () => BoardApi.getBoardById({ boardId }),
    staleTime: 1000 * 60,
    enabled: !!boardId && !!keycloak.token,
    ...options,
  });

export const useGetBoard = ({
  boardId,
  options,
}: {
  boardId: string;
  options?: Options<BoardMemberRole>;
}) => {
  return useQuery(getBoardQueryOptions(boardId, options));
};
