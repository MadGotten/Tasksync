import styles from "./Board.module.css";
import { Link } from "@tanstack/react-router";
import { Icon } from "@iconify-icon/react";

export interface BoardProps {
  id: number;
  name: string;
  is_public: boolean;
}

const PrivacyIcon = ({ isPublic }: { isPublic: boolean }) => (
  <Icon
    icon={isPublic ? "material-symbols:globe" : "material-symbols:lock-outline"}
    width='20'
    height='20'
  />
);

const FavouriteIcon = () => <Icon icon='material-symbols:star-outline' width='20' height='20' />;

const Board = ({ board }: { board: BoardProps }) => {
  return (
    <Link to='/board/$boardId' params={{ boardId: board.id.toString() }}>
      <div key={board.id} className={styles.board}>
        <img src={"https://picsum.photos/seed/45939/800/400?blur=2"}></img>
        <div className={styles["board-content"]}>
          <p className={styles["board-header"]}>{board.name}</p>
          <div className={styles["board-footer"]}>
            <PrivacyIcon isPublic={board.is_public} />
            <FavouriteIcon />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Board;
