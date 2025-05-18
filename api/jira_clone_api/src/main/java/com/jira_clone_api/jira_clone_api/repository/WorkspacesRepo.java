package com.jira_clone_api.jira_clone_api.repository;

import com.jira_clone_api.jira_clone_api.models.Workspaces;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspacesRepo extends JpaRepository<Workspaces, String> {
}
