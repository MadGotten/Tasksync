package com.madgotten.tasksync.board.exceptions;

import com.madgotten.tasksync.exceptions.ResourceNotFoundException;

public class InvitedUserNotFoundException extends ResourceNotFoundException {
    public InvitedUserNotFoundException(String message) {
        super(message);
    }
}
