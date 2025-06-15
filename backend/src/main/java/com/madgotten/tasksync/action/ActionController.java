package com.madgotten.tasksync.action;

import com.madgotten.tasksync.action.dto.ActionResponseDto;
import com.madgotten.tasksync.action.service.ActionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class ActionController {

    private final ActionService actionService;


    public ActionController(ActionService actionService) {
        this.actionService = actionService;
    }


    @GetMapping("boards/{boardId}/actions")
    @ResponseStatus(HttpStatus.OK)
    public Page<ActionResponseDto> findActionsByBoard(
            @PathVariable Integer boardId,
            @PageableDefault(size = 5, sort = "id") Pageable pageable
    ) {
        return actionService.getAllActionsByBoardId(boardId, pageable);
    }

    @GetMapping("tasks/{taskId}/actions")
    @ResponseStatus(HttpStatus.OK)
    public Page<ActionResponseDto> findActionsByTask(
            @PathVariable Integer taskId,
            @PageableDefault(size = 5, sort = "id") Pageable pageable
    ) {
        return actionService.getAllActionsByTaskId(taskId, pageable);
    }
}
