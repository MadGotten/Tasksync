package com.madgotten.tasksync.action.service;

import com.madgotten.tasksync.action.models.Action;
import com.madgotten.tasksync.action.ActionMapper;
import com.madgotten.tasksync.action.ActionRepository;
import com.madgotten.tasksync.action.models.ActionType;
import com.madgotten.tasksync.action.dto.ActionResponseDto;
import com.madgotten.tasksync.authentication.models.User;
import com.madgotten.tasksync.board.models.Board;
import com.madgotten.tasksync.task.models.Task;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ActionService {

    private final ActionRepository actionRepository;
    private final ActionMapper actionMapper;

    @Transactional
    public void createAction(ActionType actionType, String userId, Board board, Task task) {
        User user = new User();
        user.setId(UUID.fromString(userId));

        Action action = new Action();
        action.setType(actionType);
        action.setUser(user);
        action.setBoard(board);
        action.setTask(task);

        actionRepository.save(action);
    }

    @Transactional(readOnly = true)
    public Page<ActionResponseDto> getAllActionsByBoardId(Integer boardId, Pageable pageable) {
        Page<Action> actions = actionRepository.findAllByBoardId(boardId, pageable);

        return new PageImpl<>(actions
                    .stream()
                    .map(actionMapper::toActionResponseDto)
                    .collect(Collectors.toList()),
                pageable,
                actions.getTotalElements());
    }

    @Transactional(readOnly = true)
    public Page<ActionResponseDto> getAllActionsByTaskId(Integer taskId, Pageable pageable) {
        Page<Action> actions = actionRepository.findAllByTaskId(taskId, pageable);

        return new PageImpl<>(actions
                .stream()
                .map(actionMapper::toActionResponseDto)
                .collect(Collectors.toList()),
                pageable,
                actions.getTotalElements());
    }
}
