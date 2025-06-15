package com.madgotten.tasksync.board.authorization;

import com.madgotten.tasksync.board.BoardMemberRepository;
import com.madgotten.tasksync.board.models.BoardMember;
import com.madgotten.tasksync.board.models.Role;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class PermissionService {

    private BoardMemberRepository boardMemberRepository;

    public boolean checkPermission(String userId, Integer boardId, Role requiredRole) {
        UUID memberId = UUID.fromString(userId);
        Optional<BoardMember> boardMember = boardMemberRepository.findByUserIdAndBoardId(memberId, boardId);

        if(boardMember.isEmpty()) {
            return false;
        }

        Role userRole = boardMember.get().getRole();

        return userRole.hasMinimumLevel(requiredRole);
    }
}
