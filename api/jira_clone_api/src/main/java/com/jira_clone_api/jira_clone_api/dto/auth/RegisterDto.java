package com.jira_clone_api.jira_clone_api.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@AllArgsConstructor
@Getter
@Setter
public class RegisterDto {
    private String name;
    private String email;
    private String password;
}
