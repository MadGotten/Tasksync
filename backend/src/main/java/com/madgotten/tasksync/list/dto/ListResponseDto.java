package com.madgotten.tasksync.list.dto;

import com.madgotten.tasksync.board.dto.BoardResponseDto;

public record ListResponseDto(
        Integer id,
        String name,
        Integer position,
        BoardResponseDto board) {
}
