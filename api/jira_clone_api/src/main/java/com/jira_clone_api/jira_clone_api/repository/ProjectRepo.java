package com.jira_clone_api.jira_clone_api.repository;

import com.jira_clone_api.jira_clone_api.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepo extends JpaRepository<Project, String> {
    List<Project> findByWorkspaceId(String workspaceId);
}
