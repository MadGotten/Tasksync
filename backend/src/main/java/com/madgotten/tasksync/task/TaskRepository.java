package com.madgotten.tasksync.task;

import com.madgotten.tasksync.task.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer>, JpaSpecificationExecutor<Task> {

    List<Task> findAllByColumnIdAndBoardIdOrderByPositionAsc(Integer columnId, Integer boardId);

    Optional<Task> findByIdAndBoardId(Integer id, Integer boardId);

    void deleteByIdAndBoardId(Integer id, Integer boardId);
}
