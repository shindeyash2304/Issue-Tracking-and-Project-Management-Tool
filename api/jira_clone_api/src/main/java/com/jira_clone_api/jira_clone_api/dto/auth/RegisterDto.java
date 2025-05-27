package com.jira_clone_api.jira_clone_api.dto.auth;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class RegisterDto {
    @NotNull
    private String name;
    @NotNull
    private String email;
    @NotNull
    private String password;
}
