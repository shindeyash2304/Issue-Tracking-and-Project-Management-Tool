package com.jira_clone_api.jira_clone_api.dto.members;

import com.jira_clone_api.jira_clone_api.models.Members;
import com.jira_clone_api.jira_clone_api.models.Users;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReturnAllMembersProfileDto {
    @NotNull
    private Members member;
    @NotNull
    private Users user;
}
