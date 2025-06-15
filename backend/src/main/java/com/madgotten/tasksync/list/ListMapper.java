package com.madgotten.tasksync.list;


import com.madgotten.tasksync.list.dto.ListRequestDto;
import com.madgotten.tasksync.list.dto.ListOnlyResponseDto;
import com.madgotten.tasksync.list.dto.ListResponseDto;
import com.madgotten.tasksync.list.models.BoardList;
import com.madgotten.tasksync.list.service.ListService;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses= ListService.class)
public interface ListMapper {

    ListMapper INSTANCE = Mappers.getMapper( ListMapper.class );

    BoardList toBoardList(ListRequestDto listRequestDto);

    ListResponseDto fromBoardList(BoardList boardList);

    @Mapping(source = "board.id", target = "board_id")
    ListOnlyResponseDto fromBoardListOnly(BoardList boardList);

    BoardList updateBoardList(ListRequestDto listRequestDto, @MappingTarget BoardList boardList);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    BoardList updatePartialBoardList(ListRequestDto listRequestDto, @MappingTarget BoardList boardList);


}
