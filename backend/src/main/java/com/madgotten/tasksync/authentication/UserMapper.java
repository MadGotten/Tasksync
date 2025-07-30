package com.madgotten.tasksync.authentication;

import com.madgotten.tasksync.authentication.dto.UserDto;
import com.madgotten.tasksync.authentication.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
    UserDto toUserDto(User user);
}