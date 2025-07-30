package com.madgotten.tasksync.task.service;

import com.madgotten.tasksync.action.service.ActionService;
import com.madgotten.tasksync.action.models.ActionType;
import com.madgotten.tasksync.ApiConstants;
import com.madgotten.tasksync.authentication.UserRepository;
import com.madgotten.tasksync.authentication.models.User;
import com.madgotten.tasksync.list.ListRepository;
import com.madgotten.tasksync.list.exceptions.ListNotFoundException;
import com.madgotten.tasksync.list.models.BoardList;
import com.madgotten.tasksync.task.TaskMapper;
import com.madgotten.tasksync.task.TaskRepository;
import com.madgotten.tasksync.task.TaskSpecification;
import com.madgotten.tasksync.task.dto.TaskArchiveDto;
import com.madgotten.tasksync.task.dto.TaskDto;
import com.madgotten.tasksync.task.dto.TaskOnlyResponseDto;
import com.madgotten.tasksync.task.models.Task;
import com.madgotten.tasksync.task.exceptions.TaskNotFoundException;
import jakarta.persistence.criteria.JoinType;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final ListRepository listRepository;
    private final ActionService actionService;
    private final UserRepository userRepository;

    private Authentication getCurrentUser() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public List<TaskOnlyResponseDto> getAllTasksByBoard(Integer boardId, String archived) {
        return taskRepository.findAll(
                TaskSpecification.filterByArchived(archived).and((root, query, cb) -> {
                    root.fetch("assignees", JoinType.LEFT);
                    return cb.equal(root.get("boardId"), boardId);
                }),
                Sort.by("position").ascending())
                .stream()
                .map(taskMapper::fromTaskOnly)
                .collect(Collectors.toList());
    }

    public List<TaskOnlyResponseDto> getAllTasksByList(Integer boardId, Integer listId, String archived) {
        return taskRepository.findAll(
                TaskSpecification.filterByArchived(archived)
                    .and((root, query, cb) -> {
                        root.fetch("assignees", JoinType.LEFT);
                        return cb.and(
                            cb.equal(root.get("boardId"), boardId),
                            cb.equal(root.get("columnId"), listId)
                        );
                    }
                ),
                Sort.by("position").ascending()
                )
                .stream()
                .map(taskMapper::fromTaskOnly)
                .collect(Collectors.toList());
    }


    public List<TaskOnlyResponseDto> getAllTasks(Integer boardId, String archived) {
        return taskRepository.findAll(TaskSpecification.filterByArchived(archived), Sort.by("position").ascending())
                .stream()
                .map(taskMapper::fromTaskOnly)
                .collect(Collectors.toList());
    }

    public TaskOnlyResponseDto getTaskById(Integer boardId, Integer id) {
        Task task = taskRepository.findByIdAndBoardId(id, boardId)
                .orElseThrow(() -> new TaskNotFoundException(id));
        return taskMapper.fromTaskOnly(task);
    }

    @Transactional
    public TaskOnlyResponseDto createTask(Integer boardId, Integer listId, TaskDto taskDto) {
        Authentication currentUser = getCurrentUser();
        Task task = taskMapper.toTask(taskDto);

        BoardList boardList = listRepository.findByIdAndBoardId(listId, boardId).orElseThrow(() -> new ListNotFoundException(listId));
        task.setColumnId(boardList.getId());
        task.setBoardId(boardList.getBoardId());
        Task savedTask = taskRepository.save(task);

        actionService.createAction(ActionType.TASK_CREATED, currentUser.getName(), boardList.getBoard(), savedTask);

        return taskMapper.fromTaskOnly(savedTask);
    }

    @Transactional
    public TaskOnlyResponseDto updateTask(Integer boardId, Integer id, TaskDto taskDto) {
        Authentication currentUser = getCurrentUser();
        Task task = taskRepository.findByIdAndBoardId(id, boardId)
                .orElse(new Task());

        task.setName(taskDto.name());
        task.setDescription(taskDto.description());
        task.setPriority(taskDto.priority());

        Task updatedTask = taskRepository.save(task);

        actionService.createAction(ActionType.TASK_UPDATED, currentUser.getName(), updatedTask.getBoard(), updatedTask);

        return taskMapper.fromTaskOnly(updatedTask);
    }

    @Transactional
    public TaskOnlyResponseDto updatePartialTask(Integer boardId, Integer id, TaskDto taskDto) {
        Authentication currentUser = getCurrentUser();
        Task task = taskRepository.findByIdAndBoardId(id, boardId)
                .orElseThrow(() -> new TaskNotFoundException(id));


        Task mappedTask = taskMapper.updatePartialTask(taskDto, task);

        Task updatedTask = taskRepository.save(mappedTask);

        actionService.createAction(ActionType.TASK_UPDATED, currentUser.getName(), updatedTask.getBoard(), updatedTask);

        return taskMapper.fromTaskOnly(updatedTask);
    }

    @Transactional
    public void deleteTask(Integer boardId, Integer id) {
        taskRepository.deleteByIdAndBoardId(id, boardId);
    }

    @Transactional
    public TaskOnlyResponseDto archiveTask(Integer boardId, Integer id, TaskArchiveDto taskArchiveDto) {
        Authentication currentUser = getCurrentUser();
        Task task = taskRepository.findByIdAndBoardId(id, boardId)
                .orElseThrow(() -> new TaskNotFoundException(id));

        task.setArchived(taskArchiveDto.archived());

        Task updatedTask = taskRepository.save(task);

        actionService.createAction(ActionType.TASK_ARCHIVED, currentUser.getName(), updatedTask.getBoard(), updatedTask);

        return taskMapper.fromTaskOnly(updatedTask);
    }

    @Transactional
    public void orderTasks(Integer boardId, Integer listId) {
        List<Task> tasks = taskRepository.findAllByColumnIdAndBoardIdOrderByPositionAsc(listId, boardId);
        int position = ApiConstants.POSITION_INCREMENT;
        for(Task task : tasks) {
            task.setPosition(position);
            position += ApiConstants.POSITION_INCREMENT;
        }
        taskRepository.saveAll(tasks);
    }

    @Transactional
    public TaskOnlyResponseDto assignTask(Integer boardId, Integer taskId) {
        Authentication currentUser = getCurrentUser();
        Task task = taskRepository.findByIdAndBoardId(taskId, boardId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        User user = userRepository.findById(UUID.fromString(currentUser.getName()))
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        Set<User> assignees = task.getAssignees();

        if(assignees.contains(user)) {
            assignees.remove(user);
        } else {
            assignees.add(user);
        }
        task = taskRepository.save(task);

        return taskMapper.fromTaskOnly(task);
    }
}
