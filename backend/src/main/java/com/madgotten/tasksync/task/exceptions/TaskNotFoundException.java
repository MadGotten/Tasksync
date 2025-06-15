package com.madgotten.tasksync.task.exceptions;

import com.madgotten.tasksync.exceptions.ResourceNotFoundException;

public class TaskNotFoundException extends ResourceNotFoundException {
    public TaskNotFoundException(int id) {
        super("Task with ID "+ id +" was not found");
    }
}
