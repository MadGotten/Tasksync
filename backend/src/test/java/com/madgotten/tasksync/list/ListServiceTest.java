package com.madgotten.tasksync.list;

import com.madgotten.tasksync.ApiConstants;
import com.madgotten.tasksync.board.BoardRepository;
import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.list.dto.ListOnlyResponseDto;
import com.madgotten.tasksync.list.models.BoardList;
import com.madgotten.tasksync.list.service.ListService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ListServiceTest {

    @Mock
    private BoardRepository boardRepository;
    @Mock
    private ListRepository listRepository;
    @Spy
    private ListMapper listMapper = Mappers.getMapper(ListMapper.class);


    @InjectMocks
    private ListService listService;

    private Board board;
    private BoardList boardList;
    private UUID userId;


    @BeforeEach
    public void setUp() {
        userId = UUID.randomUUID();

        board = Board.builder().id(1).name("NEW_BOARD").owner(userId).build();
        boardList = BoardList.builder().id(1).name("Test").board(board).position(ApiConstants.POSITION_INCREMENT).build();
    }

    @Test
    public void getAllLists_ReturnsListOnlyResponseDto() {
        when(boardRepository.findById(board.getId())).thenReturn(Optional.ofNullable(board));
        when(listRepository.findAllByBoardIdOrderByPositionAsc(board.getId())).thenReturn(List.of(boardList));

        List<ListOnlyResponseDto> result = listService.getAllLists(board.getId());

        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(1);

        verify(boardRepository, times(1)).findById(any());
        verify(listRepository, times(1)).findAllByBoardIdOrderByPositionAsc(any());
        verify(listMapper, times(1)).fromBoardListOnly(any(BoardList.class));
    }

    @Test
    public void getListById_ReturnsListOnlyResponseDto() {
        BoardList boardList2 = BoardList.builder()
                        .id(2)
                        .name("TEST")
                        .position(ApiConstants.POSITION_INCREMENT)
                        .board(board)
                        .tasks(new ArrayList<>())
                        .build();

        when(listRepository.findByIdAndBoardId(boardList2.getId(),board.getId())).thenReturn(Optional.of(boardList2));

        ListOnlyResponseDto boardListDto = listService.getListById(board.getId(), boardList2.getId());

        assertThat(boardListDto).isNotNull();
        assertThat(boardListDto.board_id()).isEqualTo(boardList2.getBoard().getId());
        assertThat(boardListDto.name()).isEqualTo(boardList2.getName());
        assertThat(boardListDto.position()).isEqualTo(boardList2.getPosition());

        verify(listRepository, times(1)).findByIdAndBoardId(boardList2.getId(),board.getId());
        verify(listMapper, times(1)).fromBoardListOnly(any(BoardList.class));
    }
}
