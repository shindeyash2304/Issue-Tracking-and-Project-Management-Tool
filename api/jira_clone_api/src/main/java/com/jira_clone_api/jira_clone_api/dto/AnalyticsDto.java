package com.jira_clone_api.jira_clone_api.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnalyticsDto {
    @NotNull
    private int taskCount;
    @NotNull
    private int taskDifference;
    @NotNull
    private int assignedTaskCount;
    @NotNull
    private int assignedTaskDifference;
    @NotNull
    private int completedTaskCount;
    @NotNull
    private int completedTaskDifference;
    @NotNull
    private int incompleteTaskCount;
    @NotNull
    private int incompleteTaskDifference;
    @NotNull
    private int overdueTaskCount;
    @NotNull
    private int overdueTaskDifference;
}
