package com.jira_clone_api.jira_clone_api.dto.task;

import com.jira_clone_api.jira_clone_api.enums.TaskStatus;
import lombok.Data;
import org.springframework.lang.Nullable;

import java.util.Date;

@Data
public class EditTaskDto {
    @Nullable
    private String name;
    @Nullable
    private TaskStatus taskStatus;
    @Nullable
    private Date dueDate;
    @Nullable
    private String assigneeId;
    @Nullable
    private String description;
    @Nullable
    private String projectId;
}
