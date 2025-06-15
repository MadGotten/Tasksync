package com.madgotten.tasksync.task.dto;

import com.madgotten.tasksync.list.models.BoardList;
import com.madgotten.tasksync.task.models.TaskPriority;

public record TaskResponseDto(
        Integer id,
        String name,
        String description,
        TaskPriority priority,
        Boolean archived,
        Integer position,
        Integer board_id,
        BoardList column) {
}
