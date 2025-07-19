package com.madgotten.tasksync.board.models;

import com.madgotten.tasksync.action.models.Action;
import com.madgotten.tasksync.list.models.BoardList;
import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
public class Board {

    @Id
    @GeneratedValue
    private Integer id;

    private String name;

    @Builder.Default
    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = false;

    @Column(name = "owner_id", updatable=false, nullable = false)
    private UUID owner;

    @Builder.Default
    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BoardMember> members = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<BoardList> boardLists = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Action> actions = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Board board = (Board) o;
        return Objects.equals(id, board.id) && Objects.equals(name, board.name) && Objects.equals(isPublic, board.isPublic) && Objects.equals(owner, board.owner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, isPublic, owner);
    }
}
