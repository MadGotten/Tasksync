package com.madgotten.tasksync.list.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record ListRequestDto(
        @NotEmpty(message = "Column name cannot be empty")
        String name,

        @NotNull(message = "Column position cannot be null")
        Integer position) {
}
