import { ActionApi } from "@/api/actions";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetActionTask = ({ taskId }: { taskId: string }) => {
  return useInfiniteQuery({
    queryKey: ["actions", taskId, "task"],
    queryFn: ({ pageParam }) => ActionApi.getAllActionsByTask({ taskId, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      const hasNext = lastPage.page.totalPages > nextPage;
      return lastPage.page.totalPages > 0 && hasNext ? nextPage : undefined;
    },
    staleTime: 1000 * 5,
  });
};
