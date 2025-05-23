package com.jira_clone_api.jira_clone_api.exceptions;

public class FileEmptyException extends RuntimeException {
    public FileEmptyException(String message) {
        super(message);
    }
}
