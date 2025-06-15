package com.madgotten.tasksync.task.dto;

import com.madgotten.tasksync.task.models.TaskPriority;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;

public record TaskDto(
        @NotEmpty(message = "Task name cannot be empty")
        String name,

        String description,

        @NotNull(message = "Priority cannot be empty", groups = {ValidationGroups.Update.class, ValidationGroups.Priority.class})
        TaskPriority priority,

        @Nullable
        Boolean archived,

        @NotNull(message = "Task position cannot be null")
        Integer position,

        @Null
        Integer column_id) {
}
