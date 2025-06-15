import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { keycloak } from "@/api/keycloak";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    await auth.ensureInitialized();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  if (auth.isInitialized && !auth.isAuthenticated) {
    keycloak.login({ redirectUri: window.location.href });
  }

  if (!auth.isAuthenticated) {
    return;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
