package com.jira_clone_api.jira_clone_api.repository;

import com.jira_clone_api.jira_clone_api.enums.TaskStatus;
import com.jira_clone_api.jira_clone_api.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepo extends JpaRepository<Task, String> {
    Optional<Task> findByProjectId(String projectId);

    @Query("""
                SELECT t FROM Task t
                WHERE t.workspaceId = :workspaceId
                  AND (:projectId IS NULL OR t.projectId = :projectId)
                  AND (:assigneeId IS NULL OR t.assigneeId = :assigneeId)
                  AND (:taskStatus IS NULL OR t.taskStatus = :taskStatus)
                  AND (:search IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))
                  AND (:dueDate IS NULL OR t.dueDate = :dueDate)
            """)
    List<Task> findTasksByFilters(@Param("workspaceId") String workspaceId, @Param("projectId") String projectId, @Param("assigneeId") String assigneeId, @Param("taskStatus") TaskStatus taskStatus, @Param("search") String search, @Param("dueDate") String dueDate);
}
