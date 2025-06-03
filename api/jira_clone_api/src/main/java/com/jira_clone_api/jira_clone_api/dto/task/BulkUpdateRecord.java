package com.jira_clone_api.jira_clone_api.dto.task;

import com.jira_clone_api.jira_clone_api.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class BulkUpdateRecord {
    @NotNull
    private String taskId;
    @NotNull
    private TaskStatus taskStatus;
    @NotNull
    private Integer position;
}
