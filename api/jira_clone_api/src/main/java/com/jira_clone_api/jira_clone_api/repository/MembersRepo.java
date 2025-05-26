package com.jira_clone_api.jira_clone_api.repository;

import com.jira_clone_api.jira_clone_api.models.Members;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MembersRepo extends JpaRepository<Members, String> {
    List<Members> findByUserId(String userId);
    Optional<Members> findByUserIdAndWorkspaceId(String userId, String workspaceId);
    void deleteByWorkspaceId(String workspaceId);
}
