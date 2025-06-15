package com.madgotten.tasksync.board.dto;

import jakarta.validation.constraints.NotEmpty;

public record BoardInviteRequestDto (
    @NotEmpty(message = "Email cannot be empty")
    String email){

}
