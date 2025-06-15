package com.madgotten.tasksync.board.dto;

import com.madgotten.tasksync.board.models.Role;

public record GetBoardResponseDto(
        Integer id,
        String name,
        Boolean is_public,
        Role member_role) {

}
