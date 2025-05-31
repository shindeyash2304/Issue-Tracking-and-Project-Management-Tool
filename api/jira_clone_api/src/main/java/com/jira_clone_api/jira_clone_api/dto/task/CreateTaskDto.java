package com.jira_clone_api.jira_clone_api.dto.task;

import com.jira_clone_api.jira_clone_api.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.Date;

@Data
@RequiredArgsConstructor
public class CreateTaskDto {
    @NotNull
    private String name;
    @NotNull
    private TaskStatus taskStatus;
    @NotNull
    private String workspaceId;
    @NotNull
    private String projectId;
    @NotNull
    private Date dueDate;
    @NotNull
    private String assigneeId;
    private String description;
}
