package com.madgotten.tasksync.action.dto;

import com.madgotten.tasksync.action.models.ActionType;
import com.madgotten.tasksync.authentication.dto.UserDto;
import com.madgotten.tasksync.board.dto.BoardActionDto;
import com.madgotten.tasksync.task.dto.TaskActionDto;

public record ActionResponseDto(
        Integer id,
        ActionType type,
        UserDto user,
        BoardActionDto board,
        TaskActionDto task) {
}
