package com.jira_clone_api.jira_clone_api.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;
    @Column(unique = true)
    private String email;
    private String password;
    private String name;

    public Users(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }
}
