package com.madgotten.tasksync.task;
import com.madgotten.tasksync.board.authorization.RequirePermission;
import com.madgotten.tasksync.board.models.Role;
import com.madgotten.tasksync.task.dto.TaskArchiveDto;
import com.madgotten.tasksync.task.dto.TaskDto;
import com.madgotten.tasksync.task.dto.TaskOnlyResponseDto;
import com.madgotten.tasksync.task.dto.ValidationGroups;
import com.madgotten.tasksync.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/boards/{boardId}/tasks")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(value = Role.MEMBER, allowPublic = true)
    public List<TaskOnlyResponseDto> findAllTasksByBoard(@PathVariable Integer boardId,
                                                         @RequestParam(value = "archived", required = false) String archived) {
        return taskService.getAllTasksByBoard(boardId, archived);
    }

    @GetMapping("/boards/{boardId}/lists/{listId}/tasks")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(value = Role.MEMBER, allowPublic = true)
    public List<TaskOnlyResponseDto> findAllTasksByList(@PathVariable Integer boardId,
                                                        @PathVariable Integer listId,
                                                        @RequestParam(value = "archived", required = false) String archived) {
        return taskService.getAllTasksByList(boardId, listId, archived);
    }

    @PostMapping("/boards/{boardId}/lists/{listId}/tasks")
    @ResponseStatus(HttpStatus.CREATED)
    @RequirePermission(Role.MEMBER)
    public TaskOnlyResponseDto createTask(@PathVariable Integer boardId,
                                          @PathVariable Integer listId,
                                          @Valid @RequestBody TaskDto taskDto) {
        return taskService.createTask(boardId, listId, taskDto);
    }

    @GetMapping("/boards/{boardId}/tasks/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(value = Role.MEMBER, allowPublic = true)
    public TaskOnlyResponseDto findTaskById(@PathVariable Integer boardId, @PathVariable Integer id) {
        return taskService.getTaskById(boardId, id);
    }

    @PutMapping("/boards/{boardId}/tasks/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(Role.MEMBER)
    public TaskOnlyResponseDto updateTask(@PathVariable Integer boardId,
                                          @PathVariable Integer id,
                                          @Validated(ValidationGroups.Update.class) @RequestBody TaskDto taskDto) {
        return taskService.updateTask(boardId, id, taskDto);
    }

    @PatchMapping("/boards/{boardId}/tasks/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(Role.MEMBER)
    public TaskOnlyResponseDto updatePartialTask(@PathVariable Integer boardId,
                                                 @PathVariable Integer id,
                                                 @RequestBody TaskDto taskDto) {
        return taskService.updatePartialTask(boardId, id, taskDto);
    }

    @DeleteMapping("/boards/{boardId}/tasks/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequirePermission(Role.MEMBER)
    public void deleteTask(@PathVariable Integer boardId, @PathVariable Integer id) {
        taskService.deleteTask(boardId, id);
    }

    @PatchMapping("/boards/{boardId}/tasks/{id}/archive")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(Role.MEMBER)
    public TaskOnlyResponseDto archiveTask(@PathVariable Integer boardId, @PathVariable Integer id, @RequestBody TaskArchiveDto taskArchiveDto) {
        return taskService.archiveTask(boardId, id, taskArchiveDto);
    }

    @PutMapping("/boards/{boardId}/lists/{id}/tasks/order")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @RequirePermission(Role.MEMBER)
    public void orderTasks(@PathVariable Integer boardId, @PathVariable Integer id) {
        taskService.orderTasks(boardId, id);
    }
}
