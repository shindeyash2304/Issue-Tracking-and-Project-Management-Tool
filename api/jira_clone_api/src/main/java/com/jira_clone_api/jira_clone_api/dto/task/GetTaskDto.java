package com.jira_clone_api.jira_clone_api.dto.task;

import com.jira_clone_api.jira_clone_api.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

@Data
@NoArgsConstructor
public class GetTaskDto {
    @NotNull
    private String workspaceId;
    @Nullable
    private String projectId;
    @Nullable
    private String assigneeId;
    @Nullable
    private TaskStatus taskStatus;
    @Nullable
    private String search;
    @Nullable
    private String dueDate;

}
