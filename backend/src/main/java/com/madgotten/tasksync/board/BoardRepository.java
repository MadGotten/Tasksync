package com.madgotten.tasksync.board;

import com.madgotten.tasksync.board.models.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<Board, Integer> {
    Optional<Board> findByIdAndOwner(Integer Id, UUID owner);

    @Query("SELECT b FROM Board b WHERE b.owner = :userId OR EXISTS (SELECT 1 FROM BoardMember m WHERE m.board = b AND m.user.id = :userId)")
    List<Board> findAllByUserAccess(@Param("userId") UUID userId);

    @Query("SELECT b FROM Board b LEFT JOIN FETCH b.members m LEFT JOIN FETCH m.user WHERE b.id = :id")
    Optional<Board> findByIdWithMembers(@Param("id") Integer id);
}
