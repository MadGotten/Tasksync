package com.madgotten.tasksync.authentication;

import com.madgotten.tasksync.authentication.dto.UserDto;
import com.madgotten.tasksync.authentication.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/authenticate")
    @ResponseStatus(HttpStatus.OK)
    public UserDto getAuthenticatedUser(Authentication authentication) {
        return userService.getAuthenticatedUser(authentication);
    }
}
