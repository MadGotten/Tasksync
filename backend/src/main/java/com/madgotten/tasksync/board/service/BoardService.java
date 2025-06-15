package com.madgotten.tasksync.board.service;

import com.madgotten.tasksync.ApiConstants;
import com.madgotten.tasksync.action.models.ActionType;
import com.madgotten.tasksync.action.service.ActionService;
import com.madgotten.tasksync.authentication.models.User;
import com.madgotten.tasksync.authentication.UserRepository;
import com.madgotten.tasksync.authentication.dto.UserDto;
import com.madgotten.tasksync.board.BoardMapper;
import com.madgotten.tasksync.board.BoardMemberRepository;
import com.madgotten.tasksync.board.BoardRepository;
import com.madgotten.tasksync.board.dto.*;
import com.madgotten.tasksync.board.exceptions.BoardNotFoundException;
import com.madgotten.tasksync.board.exceptions.InvitedUserNotFoundException;
import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.board.models.BoardMember;
import com.madgotten.tasksync.board.models.Role;
import com.madgotten.tasksync.list.ListRepository;
import com.madgotten.tasksync.list.models.BoardList;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardMapper boardMapper;
    private final ListRepository listRepository;
    private final BoardMemberRepository boardMemberRepository;
    private final UserRepository userRepository;
    private final ActionService actionService;

    private Authentication getCurrentUser() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public List<BoardResponseDto> getAllBoards() {
        Authentication currentUser = getCurrentUser();

        return boardRepository.findAllByUserAccess(UUID.fromString(currentUser.getName()))
                .stream()
                .map(boardMapper::fromBoard)
                .collect(Collectors.toList());
    }

    public GetBoardResponseDto getBoardById(Integer id) {
        Authentication currentUser = getCurrentUser();

        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new BoardNotFoundException(id));

        Optional<BoardMember> boardMember = boardMemberRepository.findByUserIdAndBoardId(UUID.fromString(currentUser.getName()), id);

        if( boardMember.isEmpty()) {
            if (board.getIsPublic() ) {
                return boardMapper.toGetBoardResponseDto(board, Role.GUEST);
            } else {
                throw new BoardNotFoundException(id);
            }
        }

        return boardMapper.toGetBoardResponseDto(board, boardMember.get().getRole());
    }

    @Transactional
    public BoardResponseDto createBoard(BoardRequestDto boardRequestDto) {
        Authentication currentUser = getCurrentUser();

        Board board = boardMapper.toBoard(boardRequestDto);
        board.setOwner(UUID.fromString(currentUser.getName()));

        User user = new User();
        user.setId(UUID.fromString(currentUser.getName()));

        board.getMembers().add(BoardMember
                                .builder()
                                .user(user)
                                .board(board)
                                .role(Role.ADMIN)
                                .build());

        Board savedBoard = boardRepository.save(board);

        List<BoardList> defaultLists = List.of(
                BoardList.builder().name("TODO").position(ApiConstants.POSITION_INCREMENT).board(savedBoard).build(),
                BoardList.builder().name("In Progress").position(ApiConstants.POSITION_INCREMENT * 2).board(savedBoard).build(),
                BoardList.builder().name("Completed").position(ApiConstants.POSITION_INCREMENT * 3).board(savedBoard).build()
        );

        listRepository.saveAll(defaultLists);

        actionService.createAction(ActionType.BOARD_CREATED, currentUser.getName(), savedBoard, null);

        return boardMapper.fromBoard(savedBoard);
    }

    @Transactional
    public BoardResponseDto updateBoard(Integer id, BoardRequestDto boardRequestDto) {
        Authentication currentUser = getCurrentUser();

        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new BoardNotFoundException(id));

        Board updatedBoard = boardRepository.save(boardMapper.updateBoard(boardRequestDto, board));

        actionService.createAction(ActionType.BOARD_UPDATED, currentUser.getName(), updatedBoard, null);

        return boardMapper.fromBoard(updatedBoard);
    }

    @Transactional
    public BoardResponseDto updatePartialBoard(Integer id, BoardRequestDto boardRequestDto) {
        Authentication currentUser = getCurrentUser();

        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new BoardNotFoundException(id));

        Board updatedBoard = boardRepository.save(boardMapper.updatePartialBoard(boardRequestDto, board));

        actionService.createAction(ActionType.BOARD_UPDATED, currentUser.getName(), updatedBoard, null);

        return boardMapper.fromBoard(updatedBoard);
    }

    public void deleteBoard(Integer id) {
        Authentication currentUser = getCurrentUser();

        Board board = boardRepository.findByIdAndOwner(id, UUID.fromString(currentUser.getName()))
                .orElseThrow(() -> new BoardNotFoundException(id));

        boardRepository.delete(board);
    }

    @Transactional
    public void inviteToBoard(Integer id, BoardInviteRequestDto boardInviteRequestDto) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new BoardNotFoundException(id));

        User user = userRepository.findUserByEmail(boardInviteRequestDto.email()).orElseThrow(
                () -> new InvitedUserNotFoundException("User was not found " + boardInviteRequestDto.email())
        );

        board.getMembers().add(BoardMember.builder().user(user).board(board).role(Role.MEMBER).build());

        actionService.createAction(ActionType.BOARD_INVITED, user.getName(), board, null);

        boardRepository.save(board);
    }

    @Transactional(readOnly = true)
    public List<UserDto> getBoardMembers(Integer id) {
        Board board = boardRepository.findByIdWithMembers(id)
                .orElseThrow(() -> new BoardNotFoundException(id));

        Set<BoardMember> members = board.getMembers();

        return members.stream()
                .map(member -> new UserDto(member.getUser().getId(), member.getUser().getName(), member.getUser().getEmail(), member.getUser().getAvatarUrl()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBoardMember(Integer id, UUID memberId) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new BoardNotFoundException(id));

        if(board.getOwner().equals(memberId)) {
            throw new UsernameNotFoundException("Cannot remove member: " + memberId);
        }

        BoardMember boardMember = boardMemberRepository.findByUserIdAndBoardId(memberId, id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + memberId));

        board.getMembers().remove(boardMember);

        actionService.createAction(ActionType.BOARD_REMOVED, boardMember.getUser().getName(), board, null);

        boardRepository.save(board);
    }


    public boolean isBoardPublic(Integer boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundException(boardId));
        return board.getIsPublic();
    }
}
