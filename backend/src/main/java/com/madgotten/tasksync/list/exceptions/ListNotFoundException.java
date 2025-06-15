package com.madgotten.tasksync.list.exceptions;

import com.madgotten.tasksync.exceptions.ResourceNotFoundException;

public class ListNotFoundException extends ResourceNotFoundException {
    public ListNotFoundException(int id) {
        super("Column with ID "+ id +" was not found");
    }
}
