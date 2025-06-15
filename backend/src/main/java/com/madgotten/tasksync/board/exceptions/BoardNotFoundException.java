package com.madgotten.tasksync.board.exceptions;

import com.madgotten.tasksync.exceptions.ResourceNotFoundException;

public class BoardNotFoundException extends ResourceNotFoundException {
    public BoardNotFoundException(int id) {
        super("Board with ID "+ id +" was not found");
    }
}
