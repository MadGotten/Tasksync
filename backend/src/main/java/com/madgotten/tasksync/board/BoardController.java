package com.madgotten.tasksync.board;
import com.madgotten.tasksync.authentication.dto.UserDto;
import com.madgotten.tasksync.board.authorization.RequirePermission;
import com.madgotten.tasksync.board.dto.*;
import com.madgotten.tasksync.board.models.Role;
import com.madgotten.tasksync.board.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/boards")
@Transactional
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<BoardResponseDto> getAllBoards() {
        return boardService.getAllBoards();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoardResponseDto createBoard(@RequestBody @Valid BoardRequestDto boardRequestDto) {
        return boardService.createBoard(boardRequestDto);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(value = Role.MEMBER, allowPublic = true)
    public GetBoardResponseDto findBoardById(@PathVariable Integer id) {
        return boardService.getBoardById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(Role.ADMIN)
    public BoardResponseDto updateBoard(@PathVariable Integer id, @Valid @RequestBody BoardRequestDto boardRequestDto) {
        return boardService.updateBoard(id, boardRequestDto);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(Role.ADMIN)
    public BoardResponseDto updatePartialBoard(@PathVariable Integer id,  @Valid  @RequestBody BoardRequestDto boardRequestDto) {
        return boardService.updatePartialBoard(id, boardRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBoard(@PathVariable Integer id) {
        boardService.deleteBoard(id);
    }

    @PostMapping("/{id}/invitations")
    @ResponseStatus(HttpStatus.CREATED)
    @RequirePermission(Role.ADMIN)
    public void inviteToBoard(@PathVariable Integer id,
                              @RequestBody @Valid BoardInviteRequestDto boardInviteRequestDto) {
        boardService.inviteToBoard(id, boardInviteRequestDto);
    }

    @GetMapping("/{id}/members")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(Role.ADMIN)
    public List<UserDto> getAllBoardMembers(@PathVariable Integer id) {
        return boardService.getBoardMembers(id);
    }

    @DeleteMapping("/{id}/members/{memberId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequirePermission(Role.ADMIN)
    public void deleteBoardMember(@PathVariable Integer id, @PathVariable UUID memberId ) {
        boardService.deleteBoardMember(id, memberId);
    }
}
