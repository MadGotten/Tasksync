import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
import { RootRouterContext } from "@/types/routes";

export const Route = createRootRouteWithContext<RootRouterContext>()({
  component: Root,
  head: () => ({
    meta: [
      {
        title: "TaskSync ",
      },
    ],
  }),
});

function Root() {
  return (
    <>
      <HeadContent />
      <Outlet />
    </>
  );
}
