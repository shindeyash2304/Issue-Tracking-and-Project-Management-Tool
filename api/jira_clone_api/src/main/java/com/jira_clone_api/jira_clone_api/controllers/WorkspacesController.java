package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.models.Workspaces;
import com.jira_clone_api.jira_clone_api.service.UserService;
import com.jira_clone_api.jira_clone_api.service.WorkspacesService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/workspaces")
@CrossOrigin
public class WorkspacesController {

    private final WorkspacesService workspacesService;
    private final UserService userService;

    @Autowired
    public WorkspacesController(WorkspacesService workspacesService, UserService userService) {
        this.workspacesService = workspacesService;
        this.userService = userService;
    }

    @PostMapping(value = "", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Workspaces> createWorkspace(@RequestParam("name") String name, @RequestParam(value = "image", required = false) MultipartFile image, HttpServletRequest request) {
        Users user = userService.getUserByEmail(request);
        Workspaces workspace = workspacesService.createWorkspace(name, image, user.getId());
        return ResponseEntity.ok().body(workspace);
    }

    @GetMapping("")
    public ResponseEntity<List<Workspaces>> getWorkspaces(HttpServletRequest request){
        Users user = userService.getUserByEmail(request);
        return ResponseEntity.ok().body(workspacesService.getWorkspaces(user));
    }
}
