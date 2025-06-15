import { ActionApi } from "@/api/actions";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetActionBoard = ({ boardId, size }: { boardId: string; size?: number }) => {
  return useInfiniteQuery({
    queryKey: ["actions", boardId, "board"],
    queryFn: ({ pageParam }) => ActionApi.getAllActionsByBoard({ boardId, pageParam, size }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      const hasNext = lastPage.page.totalPages > nextPage;
      return lastPage.page.totalPages > 0 && hasNext ? nextPage : undefined;
    },
    staleTime: 1000 * 5,
  });
};
