package com.madgotten.tasksync.board;

import com.madgotten.tasksync.board.dto.BoardRequestDto;
import com.madgotten.tasksync.board.dto.BoardResponseDto;
import com.madgotten.tasksync.board.dto.GetBoardResponseDto;
import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.board.models.Role;
import com.madgotten.tasksync.board.service.BoardService;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, uses= BoardService.class)
public interface BoardMapper {

    BoardMapper INSTANCE = Mappers.getMapper( BoardMapper.class );

    @Mapping(source = "is_public", target = "isPublic", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_DEFAULT, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    Board toBoard(BoardRequestDto boardRequestDto);

    @Mapping(source = "isPublic", target = "is_public")
    BoardResponseDto fromBoard(Board board);

    @Mapping(source = "board.isPublic", target = "is_public")
    @Mapping(source = "userRole", target = "member_role")
    GetBoardResponseDto toGetBoardResponseDto(Board board, Role userRole);


    @Mapping(source = "is_public", target = "isPublic", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    Board updateBoard(BoardRequestDto boardRequestDto, @MappingTarget Board board);

    @Mapping(source = "is_public", target = "isPublic", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Board updatePartialBoard(BoardRequestDto boardRequestDto, @MappingTarget Board board);


}
