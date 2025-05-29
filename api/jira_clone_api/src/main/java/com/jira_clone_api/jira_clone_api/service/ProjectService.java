package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.enums.WorkspaceMemberRole;
import com.jira_clone_api.jira_clone_api.models.Project;
import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.models.Workspaces;
import com.jira_clone_api.jira_clone_api.repository.ProjectRepo;
import com.jira_clone_api.jira_clone_api.repository.WorkspacesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepo projectRepo;
    private final WorkspacesRepo workspacesRepo;
    private final FileService fileService;

    @Autowired
    public ProjectService(ProjectRepo projectRepo, WorkspacesRepo workspacesRepo, FileService fileService) {
        this.projectRepo = projectRepo;
        this.workspacesRepo = workspacesRepo;
        this.fileService = fileService;
    }

    public List<Project> getAllProjectsOfWorkspace(String workspaceId, Users user) throws Exception {
        Optional<Workspaces> workspace = workspacesRepo.findById(workspaceId);

        if (workspace.isEmpty()) {
            throw new Exception("Workspace not found");
        }

        if (workspace.get().getMembers().stream().noneMatch(member -> member.getUserId().equals(user.getId()))) {
            throw new Exception("Unauthorised");
        }

        return projectRepo.findByWorkspaceId(workspaceId);
    }

    public Project createProject(String name, String workspaceId, @Nullable MultipartFile image) {
        String res = null;
        try {
            if (image != null) {
                res = fileService.uploadFile(image, "projects");
            }
        } catch (Exception e) {
            System.out.println("Error uploading file: " + e.getMessage());
        }
        Project project = new Project();
        project.setName(name);
        project.setImageKey(res);
        project.setWorkspaceId(workspaceId);
        return projectRepo.save(project);
    }

    public Project getProjectById(String projectId, Users user) throws Exception {
        Optional<Project> project = projectRepo.findById(projectId);

        if (project.isEmpty()) {
            throw new Exception("Project not found");
        }

        Optional<Workspaces> workspace = workspacesRepo.findById(project.get().getWorkspaceId());

        if (workspace.isEmpty()) {
            throw new Exception("Workspace not found");
        }

        if (workspace.get().getMembers().stream().noneMatch(member -> member.getUserId().equals(user.getId()))) {
            throw new Exception("Unauthorised");
        }

        return project.get();
    }

    public Project updateProject(String projectId, @Nullable String name, @Nullable MultipartFile image, Users user) throws Exception {
        Optional<Project> project = projectRepo.findById(projectId);

        if (project.isEmpty()) {
            throw new Exception("Project not found");
        }

        Optional<Workspaces> workspace = workspacesRepo.findById(project.get().getWorkspaceId());

        if (workspace.isEmpty()) {
            throw new Exception("Project not found");
        }

        if (workspace.get().getMembers().stream().noneMatch(member -> member.getUserId().equals(user.getId()) && member.getRole().equals(WorkspaceMemberRole.ADMIN))) {
            throw new Exception("Unauthorised");
        }

        if (name != null) {
            project.get().setName(name);
        }

        if (image != null) {
            String fileName = fileService.updateFile(image, project.get().getImageKey(), "projects");
            project.get().setImageKey(fileName);
        }

        return projectRepo.save(project.get());
    }

    public void deleteProject(String projectId, Users user) throws Exception {
        Optional<Project> project = projectRepo.findById(projectId);

        if (project.isEmpty()) {
            throw new Exception("Project not found");
        }

        Optional<Workspaces> workspace = workspacesRepo.findById(project.get().getWorkspaceId());

        if (workspace.isEmpty()) {
            throw new Exception("Project not found");
        }

        if (workspace.get().getMembers().stream().noneMatch(member -> member.getUserId().equals(user.getId()) && member.getRole().equals(WorkspaceMemberRole.ADMIN))) {
            throw new Exception("Unauthorised");
        }

        projectRepo.deleteById(projectId);
    }
}
