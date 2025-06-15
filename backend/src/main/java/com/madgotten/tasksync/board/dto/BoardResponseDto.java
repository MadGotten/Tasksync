package com.madgotten.tasksync.board.dto;


public record BoardResponseDto(
        Integer id,
        String name,
        Boolean is_public) {
}
