package com.jira_clone_api.jira_clone_api.dto.workspaces;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddUserDto {
    @NotNull
    private String inviteCode;
}
