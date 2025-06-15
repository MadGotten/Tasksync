import "./Board.css";
import styles from "./board.module.css";
import { createFileRoute } from "@tanstack/react-router";
import { Plane, Board } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import { BoardApi } from "@/api/boards";
import { CreateBoard } from "@/features/boards/components/CreateBoard";

export const Route = createFileRoute("/_authenticated/board/")({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: "Boards | TaskSync",
      },
    ],
  }),
});

function RouteComponent() {
  const { data: boards } = useQuery({
    queryKey: ["boards"],
    queryFn: BoardApi.getAllBoards,
    staleTime: 5000,
  });

  return (
    <Plane full>
      <Plane.Header>
        <Plane.Title>Boards</Plane.Title>
        <Plane.Icons>
          <CreateBoard />
        </Plane.Icons>
      </Plane.Header>
      <div className={styles.boardGrid}>
        {boards && boards.map((board) => <Board key={board.id} board={board} />)}
      </div>
    </Plane>
  );
}
