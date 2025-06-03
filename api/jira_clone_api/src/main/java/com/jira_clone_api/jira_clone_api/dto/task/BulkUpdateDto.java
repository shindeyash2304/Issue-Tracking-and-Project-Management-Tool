package com.jira_clone_api.jira_clone_api.dto.task;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BulkUpdateDto {
    @NotNull
    private String workspaceId;
    @NotNull
    private List<BulkUpdateRecord> tasks;
}