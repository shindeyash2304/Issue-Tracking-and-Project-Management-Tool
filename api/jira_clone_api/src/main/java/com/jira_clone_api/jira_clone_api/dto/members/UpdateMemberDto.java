package com.jira_clone_api.jira_clone_api.dto.members;

import com.jira_clone_api.jira_clone_api.enums.WorkspaceMemberRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateMemberDto {
    @NotNull
    private WorkspaceMemberRole role;
}
