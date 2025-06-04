package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.dto.AnalyticsDto;
import com.jira_clone_api.jira_clone_api.dto.workspaces.AddUserDto;
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
import java.util.Objects;

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
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(workspace);
    }

    @GetMapping("")
    public ResponseEntity<List<Workspaces>> getWorkspaces(HttpServletRequest request) {
        Users user = userService.getUserByEmail(request);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(workspacesService.getWorkspaces(user));
    }

    @PatchMapping(value = "/{workspaceId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Workspaces> updateWorkspace(@PathVariable("workspaceId") String workspaceId, @RequestParam(value = "name", required = false) String workspaceName, @RequestParam(value = "image", required = false) MultipartFile image, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            Workspaces updatedWorkspace = workspacesService.updateWorkspace(workspaceId, workspaceName, image, user);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(updatedWorkspace);
        } catch (Exception e) {
            if (Objects.equals(e.getMessage(), "Unauthorised")) {
                return ResponseEntity.status(403).body(null);
            }
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping(value = "/{workspaceId}")
    public ResponseEntity<Workspaces> getWorkspaceById(@PathVariable("workspaceId") String workspaceId, HttpServletRequest request) {
        Users user = userService.getUserByEmail(request);
        try {
            return workspacesService.getWorkspaceById(workspaceId, user).map(workspace -> ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(workspace)).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping(value = "/{workspaceId}")
    public ResponseEntity<String> deleteWorkspace(@PathVariable("workspaceId") String workspaceId, HttpServletRequest request) {
        Users user = userService.getUserByEmail(request);
        try {
            workspacesService.deleteWorkspace(workspaceId, user);
            return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body("Workspace deleted successfully");
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.internalServerError().body("Failed to delete workspace: " + e.getMessage());
        }
    }

    @PatchMapping(value = "/{workspaceId}/invite-code")
    public ResponseEntity<String> updateInviteCode(@PathVariable("workspaceId") String workspaceId, HttpServletRequest request) {
        Users user = userService.getUserByEmail(request);
        try {
            String newInviteCode = workspacesService.updateInviteCode(workspaceId, user);
            return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(newInviteCode);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to update invite code: " + e.getMessage());
        }
    }

    @PostMapping("/{workspaceId}/join")
    public ResponseEntity<String> joinWorkspace(@PathVariable("workspaceId") String workspaceId, @RequestBody AddUserDto addUserDto, HttpServletRequest request) {
        Users user = userService.getUserByEmail(request);
        try {
            workspacesService.addUserToWorkspace(workspaceId, addUserDto.getInviteCode(), user);
            return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body("Joined workspace successfully");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            if (e.getMessage().equals("Invalid workspace or invite code") || e.getMessage().equals("User already a member of this workspace")) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
            return ResponseEntity.internalServerError().body("Failed to join workspace: " + e.getMessage());
        }
    }

    @GetMapping("/{workspaceId}/name")
    public ResponseEntity<String> getWorkspaceName(@PathVariable("workspaceId") String workspaceId, HttpServletRequest request) {
        Users user = userService.getUserByEmail(request);
        try {
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(workspacesService.getWorkspaceName(workspaceId));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to get workspace name: " + e.getMessage());
        }
    }

    @GetMapping("/{workspaceId}/analytics")
    public ResponseEntity<AnalyticsDto> getWorkspaceAnalytics(@PathVariable("workspaceId") String workspaceId, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            return ResponseEntity.ok().body(workspacesService.getWorkspaceAnalytics(workspaceId, user));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

}
