package com.madgotten.tasksync.board;

import com.madgotten.tasksync.board.models.BoardMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BoardMemberRepository extends JpaRepository<BoardMember, Integer>  {
    Optional<BoardMember> findByUserIdAndBoardId(UUID userId, Integer boardId);
}
