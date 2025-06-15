package com.madgotten.tasksync.action;

import com.madgotten.tasksync.action.models.Action;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActionRepository extends JpaRepository<Action, Integer> {

    //@EntityGraph(attributePaths = {"board", "task"})
    /*@Query(
        value = "SELECT a FROM Action a JOIN FETCH a.board JOIN FETCH a.task WHERE a.boardId = :boardId",
        countQuery = "SELECT COUNT(a) FROM Action a WHERE a.boardId = :boardId")*/
    @Query(
            value = "SELECT a FROM Action a JOIN FETCH a.board LEFT JOIN FETCH a.task JOIN FETCH a.user WHERE a.boardId = :boardId",
            countQuery = "SELECT COUNT(a) FROM Action a WHERE a.boardId = :boardId")
    Page<Action> findAllByBoardId(@Param("boardId") Integer boardId, Pageable pageable);

    Page<Action> findAllByTaskId(Integer taskId, Pageable pageable);
}
