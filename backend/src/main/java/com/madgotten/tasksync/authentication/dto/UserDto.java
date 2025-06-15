package com.madgotten.tasksync.authentication.dto;

import java.util.UUID;

public record UserDto(
        UUID id,
        String name,
        String email,
        String avatarUrl
) {
}
