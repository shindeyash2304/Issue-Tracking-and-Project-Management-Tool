package com.jira_clone_api.jira_clone_api.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    @NotNull
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @NotNull
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @NotNull
    @Column(name = "password", nullable = false)
    private String password;
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;
    private String imageKey;
    @NotNull
    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<Members> members;

    public Users(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }
}
