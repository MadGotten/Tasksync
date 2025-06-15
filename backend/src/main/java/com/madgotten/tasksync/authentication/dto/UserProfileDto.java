package com.madgotten.tasksync.authentication.dto;

import java.util.List;
import java.util.Map;

public record UserProfileDto(
        String id,
        String email,
        Map<String, List<String>> attributes
) {
}
