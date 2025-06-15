import { useQuery } from "@tanstack/react-query";
import { getBoardQueryOptions } from "@/features/boards/api/useGetBoard";
import { BoardMemberRole } from "@/types/api";

export const useGetPermission = ({ boardId }: { boardId: string }) => {
  const options = getBoardQueryOptions(boardId);
  return useQuery({
    ...options,
    select: (data: BoardMemberRole) => data.member_role,
    staleTime: Infinity,
  });
};
