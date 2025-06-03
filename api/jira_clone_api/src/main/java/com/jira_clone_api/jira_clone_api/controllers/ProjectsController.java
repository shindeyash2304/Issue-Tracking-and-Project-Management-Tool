package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.models.Project;
import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.service.ProjectService;
import com.jira_clone_api.jira_clone_api.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectsController {

    private final ProjectService projectService;
    private final UserService userService;

    @Autowired
    public ProjectsController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @GetMapping("")
    public ResponseEntity<List<Project>> getAllProjectsOfWorkspace(@RequestParam(required = true) String workspaceId, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            return ResponseEntity.ok().body(projectService.getAllProjectsOfWorkspace(workspaceId, user));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Project> createProject(@RequestParam(value = "name", required = true) String name, @RequestParam(value = "workspaceId", required = true) String workspaceId, @RequestParam(value = "image", required = false) MultipartFile image, HttpServletRequest request) {
        try {

            Users user = userService.getUserByEmail(request);
            Project project = projectService.createProject(name, workspaceId, image);
            return ResponseEntity.created(URI.create("/workspaces/" + workspaceId + "projects/" + project.getId())).body(project);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectMyId(@PathVariable("projectId") String projectId, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            return ResponseEntity.ok().body(projectService.getProjectById(projectId, user));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping(value = "/{projectId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Project> updateProject(@PathVariable("projectId") String projectId, @RequestParam(value = "name", required = false) String name, @RequestParam(value = "image", required = false) MultipartFile image, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            return ResponseEntity.ok().body(projectService.updateProject(projectId, name, image, user));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping(value = "/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable("projectId") String projectId, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            projectService.deleteProject(projectId, user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
