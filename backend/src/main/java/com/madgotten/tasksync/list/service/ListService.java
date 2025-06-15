package com.madgotten.tasksync.list.service;

import com.madgotten.tasksync.ApiConstants;
import com.madgotten.tasksync.board.BoardRepository;
import com.madgotten.tasksync.board.exceptions.BoardNotFoundException;
import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.list.ListMapper;
import com.madgotten.tasksync.list.ListRepository;
import com.madgotten.tasksync.list.dto.ListOnlyResponseDto;
import com.madgotten.tasksync.list.dto.ListRequestDto;
import com.madgotten.tasksync.list.exceptions.ListNotFoundException;
import com.madgotten.tasksync.list.models.BoardList;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
import java.util.List;

@Service
public class ListService {

    private final BoardRepository boardRepository;
    private final ListRepository listRepository;
    private final ListMapper listMapper;

    public ListService(BoardRepository boardRepository, ListRepository listRepository, ListMapper listMapper) {
        this.boardRepository = boardRepository;
        this.listRepository = listRepository;
        this.listMapper = listMapper;
    }

    public List<ListOnlyResponseDto> getAllLists(Integer boardId) {
        boardRepository.findById(boardId).orElseThrow(() -> new BoardNotFoundException(boardId));
        return listRepository.findAllByBoardIdOrderByPositionAsc(boardId)
                .stream()
                .map(listMapper::fromBoardListOnly)
                .collect(Collectors.toList());
    }

    public ListOnlyResponseDto getListById(Integer boardId, Integer id) {
        BoardList boardList = listRepository.findByIdAndBoardId(id, boardId)
                .orElseThrow(() -> new ListNotFoundException(id));
        return listMapper.fromBoardListOnly(boardList);
    }

    public ListOnlyResponseDto createList(Integer boardId, ListRequestDto listRequestDto) {
        BoardList boardList = listMapper.toBoardList(listRequestDto);
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new BoardNotFoundException(boardId));

        boardList.setBoard(board);
        BoardList savedBoardList = listRepository.save(boardList);
        return listMapper.fromBoardListOnly(savedBoardList);
    }

    public ListOnlyResponseDto updateList(Integer boardId, Integer id, ListRequestDto listRequestDto) {
        BoardList boardList = listRepository.findByIdAndBoardId(id, boardId)
                .orElseThrow(() -> new ListNotFoundException(id));

        BoardList updatedBoardList = listRepository.save(listMapper.updateBoardList(listRequestDto, boardList));

        return listMapper.fromBoardListOnly(updatedBoardList);
    }

    public ListOnlyResponseDto updatePartialList(Integer boardId, Integer id, ListRequestDto listRequestDto) {
        BoardList boardList = listRepository.findByIdAndBoardId(id, boardId)
                .orElseThrow(() -> new ListNotFoundException(id));

        BoardList updatedBoardList = listRepository.save(listMapper.updatePartialBoardList(listRequestDto, boardList));
        return listMapper.fromBoardListOnly(updatedBoardList);
    }

    @Transactional
    public void deleteList(Integer boardId, Integer id) {
        listRepository.deleteByIdAndBoardId(id, boardId);
    }

    @Transactional
    public void orderLists(Integer boardId) {
        List<BoardList> boardLists = listRepository.findAllByBoardIdOrderByPositionAsc(boardId);
        int position = ApiConstants.POSITION_INCREMENT;
        for(BoardList boardList : boardLists) {
            boardList.setPosition(position);
            position += ApiConstants.POSITION_INCREMENT;
        }
        listRepository.saveAll(boardLists);
    }

}
