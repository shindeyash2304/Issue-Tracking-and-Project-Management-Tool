package com.jira_clone_api.jira_clone_api.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "project")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Project {
    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @NotNull
    private String workspaceId;
    @NotNull
    private String name;
    private String imageKey;
    @ManyToOne
    @JoinColumn(name = "workspaceId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonBackReference
    private Workspaces workspace;
    @OneToMany(mappedBy = "project")
    @JsonManagedReference
    private List<Task> tasks;
}
