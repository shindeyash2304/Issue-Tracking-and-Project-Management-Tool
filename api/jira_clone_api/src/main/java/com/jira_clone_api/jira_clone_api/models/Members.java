package com.jira_clone_api.jira_clone_api.models;

import com.jira_clone_api.jira_clone_api.enums.WorkspaceMemberRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Members {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false)
    private String userId;
    @Column(nullable = false)
    private String workspaceId;
    @Column(nullable = false)
    private WorkspaceMemberRole role;

    public Members(String userId, String workspaceId, WorkspaceMemberRole role){
        this.role = role;
        this.workspaceId = workspaceId;
        this.userId = userId;
    }
}
