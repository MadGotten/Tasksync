package com.madgotten.tasksync.list;

import com.madgotten.tasksync.list.models.BoardList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListRepository extends JpaRepository<BoardList, Integer> {
    List<BoardList> findAllByBoardIdOrderByPositionAsc(Integer boardId);

    Optional<BoardList> findByIdAndBoardId(Integer id, Integer boardId);

    void deleteByIdAndBoardId(Integer id, Integer boardId);
}
