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
            <p className={styles.description}>
              Tired of losing track of your progress? TaskSync is here to help you stay organized
              and focused. Whether you're a student, a professional, or just someone who wants to
              get things done, TaskSync has got you covered.
            </p>
            <Link to='/board'>
              <Button variant='primary' size='lg' full fs='sm'>
                <Icon icon='ph:star-four-bold' width='20' height='18' />
                {auth.isAuthenticated ? "Go to Boards" : "Join now!"}
              </Button>
            </Link>
            <img className={styles.landingPreview} src='landing-preview.jpg'></img>
          </div>
          <div className={styles.features}>
            <div className={styles.feat}>
              <p className={styles.featName}>Monitor user actions</p>
              <p className={styles.featDescription}>Keep track of user interactions</p>
            </div>
            <div className={styles.feat}>
              <p className={styles.featName}>Secure & Private</p>
              <div className={styles.secureIcon}>
                <div className={styles.ring} />
                <div className={styles.ring} />
                <div className={styles.ring} />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className={styles.lockIcon}
                  viewBox='0 0 24 32'
                >
                  <path
                    fill='currentColor'
                    d='M0 18a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V18ZM4 8a8 8 0 1 1 16 0v4H4V8Z'
                  />
                  <path
                    fill='var(--list-background)'
                    d='M8 8a4 4 0 1 1 8 0v5H8V8Zm8 15a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'
                  />
                </svg>
              </div>
            </div>
            <div className={styles.feat}>
              <p className={styles.featName}>Collaborate Together</p>
              <p className={styles.featDescription}>
                Stay in sync with your team and achieve more together.
              </p>
            </div>
            <div className={styles.feat}>
              <p className={styles.featName}>Smart Task Management</p>
              <p className={styles.featDescription}>
                Stay organized and focused with task prioritization.
              </p>
            </div>
          </div>
          <footer className={styles.footer} />
        </div>
      </Plane>
    </>
  );
}
