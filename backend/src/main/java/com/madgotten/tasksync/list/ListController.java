package com.madgotten.tasksync.list;

import com.madgotten.tasksync.board.authorization.RequirePermission;
import com.madgotten.tasksync.board.models.Role;
import com.madgotten.tasksync.list.dto.ListOnlyResponseDto;
import com.madgotten.tasksync.list.dto.ListRequestDto;
import com.madgotten.tasksync.list.dto.ValidationGroups;
import com.madgotten.tasksync.list.service.ListService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
public class ListController {

    private final ListService listService;

    @GetMapping("/boards/{boardId}/lists")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(value = Role.MEMBER, allowPublic = true)
    public List<ListOnlyResponseDto> findAllLists(@PathVariable Integer boardId) {
        return listService.getAllLists(boardId);
    }

    @PostMapping("/boards/{boardId}/lists")
    @ResponseStatus(HttpStatus.CREATED)
    @RequirePermission(Role.MEMBER)
    public ListOnlyResponseDto createList(@PathVariable Integer boardId, @Valid @RequestBody ListRequestDto listRequestDto) {
        return listService.createList(boardId, listRequestDto);
    }

    @GetMapping("/boards/{boardId}/lists/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(value = Role.MEMBER, allowPublic = true)
    public ListOnlyResponseDto findListById(@PathVariable Integer boardId, @PathVariable Integer id) {
        return listService.getListById(boardId, id);
    }

    @PutMapping("/boards/{boardId}/lists/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(Role.MEMBER)
    public ListOnlyResponseDto updateList(@PathVariable Integer boardId, @PathVariable Integer id, @Validated(ValidationGroups.Update.class) @RequestBody ListRequestDto listRequestDto) {
        return listService.updateList(boardId, id, listRequestDto);
    }

    @PatchMapping("/boards/{boardId}/lists/{id}")
    @ResponseStatus(HttpStatus.OK)
    @RequirePermission(Role.MEMBER)
    public ListOnlyResponseDto updatePartialList(@PathVariable Integer boardId, @PathVariable Integer id, @Validated(ValidationGroups.Update.class) @RequestBody ListRequestDto listRequestDto) {
        return listService.updatePartialList(boardId, id, listRequestDto);
    }

    @DeleteMapping("/boards/{boardId}/lists/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequirePermission(Role.MEMBER)
    public void deleteList(@PathVariable Integer boardId, @PathVariable Integer id) {
        listService.deleteList(boardId, id);
    }

    @PutMapping("/boards/{boardId}/lists/order")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @RequirePermission(Role.MEMBER)
    public void orderLists(@PathVariable Integer boardId) {
        listService.orderLists(boardId);
    }

}
