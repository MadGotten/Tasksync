package com.madgotten.tasksync.board;

import com.madgotten.tasksync.action.models.ActionType;
import com.madgotten.tasksync.action.service.ActionService;
import com.madgotten.tasksync.authentication.models.User;
import com.madgotten.tasksync.board.dto.BoardRequestDto;
import com.madgotten.tasksync.board.dto.BoardResponseDto;
import com.madgotten.tasksync.board.dto.GetBoardResponseDto;
import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.board.models.BoardMember;
import com.madgotten.tasksync.board.models.Role;
import com.madgotten.tasksync.board.service.BoardService;
import com.madgotten.tasksync.list.ListRepository;
import com.madgotten.tasksync.task.models.Task;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;
import java.util.stream.StreamSupport;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BoardServiceTest {

    @Mock
    private BoardRepository boardRepository;
    @Spy
    private BoardMapper boardMapper = Mappers.getMapper(BoardMapper.class);
    @Mock
    private ListRepository listRepository;
    @Mock
    private BoardMemberRepository boardMemberRepository;
    @Mock
    private ActionService actionService;
    @Mock
    private Authentication authentication;
    @Mock
    private SecurityContext securityContext;


    @InjectMocks
    private BoardService boardService;

    private Board board;
    private User user;
    private UUID userId;


    @BeforeEach
    public void setUp() {
        userId = UUID.randomUUID();
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(authentication.getName()).thenReturn(userId.toString());
        SecurityContextHolder.setContext(securityContext);

        board = Board.builder().id(1).name("NEW_BOARD").owner(userId).build();
        user = User.builder().id(userId).name("test_user").email("test_user@test.com").avatarUrl("img").build();
    }

    @Test
    public void getAllBoard_ReturnsBoardResponseDto() {
        Board board1 = Board.builder().id(2).name("TEST_BOARD").owner(userId).build();
        List<Board> boards = List.of(board, board1);

        when(boardRepository.findAllByUserAccess(userId)).thenReturn(boards);

        List<BoardResponseDto> result = boardService.getAllBoards();

        assertThat(result).isNotNull();
        assertThat(result.size()).isEqualTo(2);

        verify(boardRepository, times(1)).findAllByUserAccess(any());
        verify(boardMapper, times(2)).fromBoard(any(Board.class));
    }

    @Test
    public void getBoardById_ReturnsGetBoardResponseDto() {
        BoardMember member = BoardMember.builder()
                        .board(board)
                        .user(new User(userId, "test", "test@email.com", "avatar"))
                        .role(Role.ADMIN)
                        .build();

        when(boardRepository.findById(board.getId())).thenReturn(Optional.of(board));
        when(boardMemberRepository.findByUserIdAndBoardId(userId, board.getId()))
                .thenReturn(Optional.of(member));

        GetBoardResponseDto boardDto = boardService.getBoardById(board.getId());

        assertThat(boardDto).isNotNull();
        assertThat(boardDto.id()).isEqualTo(board.getId());
        assertThat(boardDto.name()).isEqualTo(board.getName());
        assertThat(boardDto.member_role()).isEqualTo(Role.ADMIN);

        verify(boardRepository, times(1)).findById(board.getId());
        verify(boardMemberRepository, times(1)).findByUserIdAndBoardId(userId, board.getId());
        verify(boardMapper, times(1)).toGetBoardResponseDto(any(Board.class), any(Role.class));
    }

    @Test
    public void createBoard_ReturnsBoardResponseDto_WhenBoardIsCreated() {
        BoardRequestDto request = new BoardRequestDto("NEW BOARD", false);

        Board savedBoard = Board.builder().id(2).name("NEW_BOARD").owner(userId).build();

        when(boardRepository.save(any(Board.class))).thenReturn(savedBoard);
        doNothing().when(actionService).createAction(any(ActionType.class), anyString(), any(Board.class),  isNull());


        BoardResponseDto boardDto = boardService.createBoard(request);

        assertThat(boardDto).isNotNull();
        assertThat(boardDto.id()).isEqualTo(savedBoard.getId());
        assertThat(boardDto.name()).isEqualTo(savedBoard.getName());
        verify(boardRepository, times(1)).save(any(Board.class));


        verify(listRepository).saveAll(argThat(lists ->
                StreamSupport.stream(lists.spliterator(), false).count() == 3
        ));
    }

    @Test
    public void updateBoard_ReturnsBoardResponseDto_WhenBoardIsUpdated() {
        BoardRequestDto boardRequestDto = new BoardRequestDto("UPDATED_BOARD", false);

        BoardMember member = BoardMember.builder().user(user).board(board).role(Role.ADMIN).build();

        Board updatedBoard = new Board(1, "UPDATED_BOARD", false ,userId, Set.of(member) ,null);
        BoardResponseDto expectBoard = new BoardResponseDto(1, "UPDATED_BOARD", false);


        when(boardRepository.findById(board.getId())).thenReturn(Optional.of(board));
        when(boardRepository.save(any(Board.class))).thenReturn(updatedBoard);
        doNothing().when(actionService).createAction(any(ActionType.class), anyString(), any(Board.class), isNull());


        BoardResponseDto result = boardService.updateBoard(board.getId(), boardRequestDto);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(1);
        assertThat(result.name()).isEqualTo("UPDATED_BOARD");
        assertThat(result).isEqualTo(expectBoard);

        verify(boardRepository, times(1)).findById(any());
        verify(boardRepository, times(1)).save(any(Board.class));
    }
}
