package com.madgotten.tasksync.action;

import com.madgotten.tasksync.action.dto.ActionResponseDto;
import com.madgotten.tasksync.action.models.Action;
import com.madgotten.tasksync.list.service.ListService;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses= ListService.class)
public interface ActionMapper {
    //@Mapping(target = "user", expression = "java(users.get(action.getUser()))")
    //ActionResponseDto toActionResponseDto(Action action, @Context Map<String, UserProfileDto> users);

    ActionResponseDto toActionResponseDto(Action action);
}



