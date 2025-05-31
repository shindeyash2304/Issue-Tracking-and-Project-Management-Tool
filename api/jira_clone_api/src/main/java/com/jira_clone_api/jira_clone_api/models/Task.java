package com.jira_clone_api.jira_clone_api.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jira_clone_api.jira_clone_api.enums.TaskStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "task")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {
    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @NotNull
    private String name;
    @NotNull
    private String workspaceId;
    @NotNull
    private String projectId;
    @NotNull
    private String assigneeId;
    private String description;
    @NotNull
    private Date dueDate;
    @NotNull
    private TaskStatus taskStatus;
    @NotNull
    private Integer position;
    @ManyToOne
    @JoinColumn(name = "workspaceId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonBackReference
    private Workspaces workspace;
    @ManyToOne
    @JoinColumn(name = "projectId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonBackReference
    private Project project;
    @ManyToOne
    @JoinColumn(name = "assigneeId", referencedColumnName = "id", insertable = false, updatable = false, table = "")
    @JsonBackReference
    private Members member;

}
