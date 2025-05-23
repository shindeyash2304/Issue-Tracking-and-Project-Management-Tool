package com.jira_clone_api.jira_clone_api.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID )
    private String id;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false)
    private String name;
    private String imageKey;

    public Users(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }
}
