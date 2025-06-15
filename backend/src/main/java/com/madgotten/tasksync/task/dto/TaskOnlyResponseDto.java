package com.madgotten.tasksync.task.dto;

import com.madgotten.tasksync.task.models.TaskPriority;

public record TaskOnlyResponseDto(
        Integer id,
        String name,
        String description,
        TaskPriority priority,
        Boolean archived,
        Integer position,
        Integer board_id,
        Integer column_id) {
}
