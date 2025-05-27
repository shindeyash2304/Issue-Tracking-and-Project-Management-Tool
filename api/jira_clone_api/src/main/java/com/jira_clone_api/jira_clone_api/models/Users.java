package com.jira_clone_api.jira_clone_api.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.UUID )
    private String id;
    @NotNull
    @Column(unique = true, nullable = false)
    private String email;
    @NotNull
    @Column(nullable = false)
    private String password;
    @NotNull
    @Column(nullable = false)
    private String name;
    private String imageKey;
    @NotNull
    @OneToMany
    @JsonManagedReference
    private List<Members> members;

    public Users(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }
}
