package com.jira_clone_api.jira_clone_api.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
public class LoginDto {
    @NotNull
    private String email;
    @NotNull
    private String password;
}
