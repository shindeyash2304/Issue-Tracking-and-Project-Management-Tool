package com.jira_clone_api.jira_clone_api.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "workspace")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Workspaces {
    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @NotNull
    @Column(length = 255, nullable = false)
    private String name;
    @NotNull
    @Column(length = 50, nullable = false)
    private String userId;
    private String imageUrl;
    @NotNull
    @Column(length = 10, nullable = false, unique = true)
    private String inviteCode;
    @NotNull
    @OneToMany(mappedBy = "workspace")
    @JsonManagedReference
    private List<Members> members;
    @OneToMany(mappedBy = "workspace")
    @JsonManagedReference
    private List<Project> projects;
    @OneToMany(mappedBy = "workspace")
    @JsonManagedReference
    private List<Task> tasks;
}
