package com.jira_clone_api.jira_clone_api.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginDto {
    @NotNull
    private String email;
    @NotNull
    private String password;
}
