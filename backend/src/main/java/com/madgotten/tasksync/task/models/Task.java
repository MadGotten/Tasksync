package com.madgotten.tasksync.task.models;

import com.madgotten.tasksync.action.models.Action;
import com.madgotten.tasksync.authentication.models.User;
import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.list.models.BoardList;
import jakarta.persistence.*;
import lombok.*;
import lombok.Builder.Default;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

//@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Task {

    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority;

    @Default
    private Boolean archived = false;

    private Integer position;

    @Column(name="board_id")
    private Integer boardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="board_id", insertable=false, updatable=false)
    private Board board;

    @Column(name="column_id")
    private Integer columnId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="column_id", insertable=false, updatable=false)
    private BoardList column;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "task_assignees",
            joinColumns = @JoinColumn(name = "task_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Default
    private Set<User> assignees = new HashSet<>();

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Action> actions;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return Objects.equals(id, task.id) && Objects.equals(name, task.name) && Objects.equals(description, task.description) && priority == task.priority && Objects.equals(archived, task.archived) && Objects.equals(position, task.position) && Objects.equals(boardId, task.boardId) && Objects.equals(columnId, task.columnId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, priority, archived, position, boardId, columnId);
    }
}
