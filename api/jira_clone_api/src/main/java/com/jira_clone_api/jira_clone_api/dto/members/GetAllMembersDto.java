package com.jira_clone_api.jira_clone_api.dto.members;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class GetAllMembersDto {
    @NotNull
    private String workspaceId;
}
