import styles from "./home.module.css";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Plane, Button } from "@/components/ui";
import { Icon } from "@iconify-icon/react";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    const { auth } = context;
    await auth.ensureInitialized();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { auth } = Route.useRouteContext();

  return (
    <>
      <Navbar />
      <Plane>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.ambientBackground}></div>
            <h1 className={styles.heading}>
              Manage your tasks with <span className={styles.highlight}>ease</span> by using
              TaskSync.
            </h1>
            <Link to='/board'>
              <Button variant='primary' size='lg' full fs='sm'>
                <Icon icon='ph:star-four-bold' width='20' height='18' />
                {auth.isAuthenticated ? "Go to Boards" : "Join now!"}
              </Button>
            </Link>
          </div>
        </div>
      </Plane>
    </>
  );
}
