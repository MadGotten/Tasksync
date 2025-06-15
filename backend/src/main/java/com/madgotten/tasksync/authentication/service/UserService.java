package com.madgotten.tasksync.authentication.service;

import com.madgotten.tasksync.authentication.UserRepository;
import com.madgotten.tasksync.authentication.dto.UserDto;
import com.madgotten.tasksync.authentication.models.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;


    public UserDto getAuthenticatedUser(Authentication authentication) {
        UUID userId = UUID.fromString(authentication.getName());

        Jwt jwt = (Jwt) authentication.getPrincipal();

        Optional<User> user = userRepository.findById(userId);

        User jwtUser = new User();
        jwtUser.setId(userId);
        jwtUser.setName(jwt.getClaimAsString("preferred_username"));
        jwtUser.setEmail(jwt.getClaimAsString("email"));
        jwtUser.setAvatarUrl(jwt.getClaimAsString("picture"));

        if(user.isPresent()) {
            User dbUser = user.get();
            if(!dbUser.equals(jwtUser)) {
                dbUser.setName(jwtUser.getName());
                dbUser.setEmail(jwtUser.getEmail());
                dbUser.setAvatarUrl(jwtUser.getAvatarUrl());
                userRepository.save(dbUser);

                return new UserDto(dbUser.getId(), dbUser.getName(), dbUser.getEmail(), dbUser.getAvatarUrl());
            }
        }

        User savedUser = userRepository.save(jwtUser);
        return new UserDto(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getAvatarUrl());
    }
}
