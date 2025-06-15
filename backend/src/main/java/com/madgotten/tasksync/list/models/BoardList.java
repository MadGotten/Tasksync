package com.madgotten.tasksync.list.models;

import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.task.models.Task;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Objects;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name="board_list")
public class BoardList {

    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    private Integer position;

    @Column(name="board_id", insertable=false, updatable=false)
    private Integer boardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="board_id", nullable=false)
    private Board board;

    @OneToMany(mappedBy = "column", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Task> tasks;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        BoardList boardList = (BoardList) o;
        return Objects.equals(id, boardList.id) && Objects.equals(name, boardList.name) && Objects.equals(position, boardList.position) && Objects.equals(boardId, boardList.boardId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, position, boardId);
    }

    ;}
