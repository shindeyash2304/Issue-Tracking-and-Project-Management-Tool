package com.jira_clone_api.jira_clone_api.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.jira_clone_api.jira_clone_api.enums.WorkspaceMemberRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Members {
    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @NotNull
    @Column(nullable = false)
    private String userId;
    @NotNull
    @Column(nullable = false)
    private String workspaceId;
    @NotNull
    @Column(nullable = false)
    private WorkspaceMemberRole role;
    @NotNull
    @ManyToOne
    @JoinColumn(name = "workspaceId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonBackReference
    private Workspaces workspace;
    @NotNull
    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id", insertable = false, updatable = false)
    @JsonBackReference
    private Users user;

    public Members(String userId, String workspaceId, WorkspaceMemberRole role){
        this.role = role;
        this.workspaceId = workspaceId;
        this.userId = userId;
    }
}
