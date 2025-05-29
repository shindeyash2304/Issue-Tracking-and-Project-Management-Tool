package com.jira_clone_api.jira_clone_api.repository;

import com.jira_clone_api.jira_clone_api.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepo extends JpaRepository<Project, String> {
    List<Project> findByWorkspaceId(String workspaceId);
}
