package com.madgotten.tasksync.list.dto;

public record ListOnlyResponseDto(
        Integer id,
        String name,
        Integer position,
        Integer board_id) {
}
