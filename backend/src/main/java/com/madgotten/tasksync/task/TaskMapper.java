package com.madgotten.tasksync.task;

import com.madgotten.tasksync.authentication.UserMapper;
import com.madgotten.tasksync.task.dto.TaskDto;
import com.madgotten.tasksync.task.dto.TaskOnlyResponseDto;
import com.madgotten.tasksync.task.dto.TaskResponseDto;
import com.madgotten.tasksync.task.models.Task;
import com.madgotten.tasksync.task.service.TaskService;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses= {TaskService.class, UserMapper.class})
public interface TaskMapper {

    TaskMapper INSTANCE = Mappers.getMapper( TaskMapper.class );

    @Mapping(source="archived", target="archived", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_DEFAULT, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    Task toTask(TaskDto taskDto);

    TaskResponseDto fromTask(Task task);
    
    @Mapping(source = "columnId", target = "column_id")
    @Mapping(source = "boardId", target = "board_id")
    @Mapping(source = "assignees", target = "assignees")
    TaskOnlyResponseDto fromTaskOnly(Task task);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "column_id", target = "columnId")
    Task updatePartialTask(TaskDto taskDto, @MappingTarget Task task);
}
