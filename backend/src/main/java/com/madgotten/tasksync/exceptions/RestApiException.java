package com.madgotten.tasksync.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.HashMap;

@Data
public class RestApiException {
    private Integer status;
    private String message;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private HashMap<String, String> errors = new HashMap<>();

    public void addError(String key, String errorMessage) {
        this.errors.put(key, errorMessage);
    }

    public void addErrors(HashMap<String, String> errorMap) {
        this.errors.putAll(errorMap);
    }
}