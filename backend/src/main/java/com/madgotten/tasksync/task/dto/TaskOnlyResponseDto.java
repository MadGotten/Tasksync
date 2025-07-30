package com.madgotten.tasksync.task.dto;

import com.madgotten.tasksync.authentication.dto.UserDto;
import com.madgotten.tasksync.task.models.TaskPriority;

import java.util.Set;

public record TaskOnlyResponseDto(
        Integer id,
        String name,
        String description,
        TaskPriority priority,
        Boolean archived,
        Integer position,
        Integer board_id,
        Integer column_id,
        Set<UserDto> assignees) {
}
