package com.jira_clone_api.jira_clone_api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Workspaces {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(length = 255,nullable = false)
    private String name;
    @Column(length = 50, nullable = false)
    private String userId;
}
