package com.madgotten.tasksync.action.models;

import com.madgotten.tasksync.authentication.models.User;
import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.task.models.Task;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Action {
    @Id
    @GeneratedValue
    private Integer id;

    @Enumerated(EnumType.STRING)
    private ActionType type;

    @Column(name = "user_id", insertable=false, updatable=false)
    private UUID userId;

    @Column(name="board_id", insertable=false, updatable=false)
    private Integer boardId;

    @Column(name="task_id", insertable=false, updatable=false)
    private Integer taskId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="board_id", nullable=false)
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="task_id")
    private Task task;

}