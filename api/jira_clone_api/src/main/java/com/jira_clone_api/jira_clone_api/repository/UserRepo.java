package com.jira_clone_api.jira_clone_api.repository;

import com.jira_clone_api.jira_clone_api.models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<Users,String> {
    Users findByEmail(String email);
}
