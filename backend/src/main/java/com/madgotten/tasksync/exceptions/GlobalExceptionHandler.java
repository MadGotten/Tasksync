package com.madgotten.tasksync.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    RestApiException handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        RestApiException restApiException = new RestApiException();
        restApiException.setStatus(HttpStatus.BAD_REQUEST.value());
        restApiException.setMessage("Validation failed.");
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            restApiException.addError(fieldError.getField(), fieldError.getDefaultMessage());
        });
        return restApiException;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseBody
    RestApiException handleResourceNotFoundException(ResourceNotFoundException ex) {
        RestApiException restApiException = new RestApiException();
        restApiException.setStatus(HttpStatus.NOT_FOUND.value());
        restApiException.setMessage(ex.getMessage());
        return restApiException;
    }
}
