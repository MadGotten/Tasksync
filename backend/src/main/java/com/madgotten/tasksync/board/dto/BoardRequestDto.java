package com.madgotten.tasksync.board.dto;

import jakarta.validation.constraints.NotEmpty;

public record BoardRequestDto(
        @NotEmpty(message = "Board name cannot be empty")
        String name,

        Boolean is_public) {
}
