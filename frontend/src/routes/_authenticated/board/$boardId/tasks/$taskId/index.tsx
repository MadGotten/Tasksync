import { keycloak } from "@/api/keycloak";
import { TaskApi } from "@/api/tasks";
import { TaskDetails } from "@/features/tasks/components/TaskDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/board/$boardId/tasks/$taskId/")({
  loader: async ({ params: { taskId, boardId } }) => {
    if (!keycloak.authenticated) {
      throw new Error("User is not authenticated");
    }
    const task = await TaskApi.getTaskById(parseInt(boardId), parseInt(taskId));

    return { task };
  },
  component: RouteComponent,
  head: (ctx) => {
    const { task } = ctx.loaderData;

    return {
      meta: [
        {
          title: `Task ${task.name} | TaskSync`,
        },
      ],
    };
  },
  staleTime: 1000 * 5,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const params = Route.useParams();

  const { task } = Route.useLoaderData();

  const close = () => {
    navigate({
      to: "/board/$boardId",
      params: { boardId: params.boardId.toString() },
    });
  };

  return <TaskDetails onClose={close} task={task} />;
}
