package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.dto.AnalyticsDto;
import com.jira_clone_api.jira_clone_api.enums.TaskStatus;
import com.jira_clone_api.jira_clone_api.enums.WorkspaceMemberRole;
import com.jira_clone_api.jira_clone_api.models.Members;
import com.jira_clone_api.jira_clone_api.models.Task;
import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.models.Workspaces;
import com.jira_clone_api.jira_clone_api.repository.MembersRepo;
import com.jira_clone_api.jira_clone_api.repository.WorkspacesRepo;

import com.jira_clone_api.jira_clone_api.utils.SecureRandomString;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class WorkspacesService {

    private final WorkspacesRepo workspacesRepo;
    private final FileService fileService;
    private final MembersRepo membersRepo;

    @Autowired
    public WorkspacesService(WorkspacesRepo workspacesRepo, FileServiceImpl fileService, MembersRepo membersRepo) {
        this.workspacesRepo = workspacesRepo;
        this.fileService = fileService;
        this.membersRepo = membersRepo;
    }

    @Transactional
    public Workspaces createWorkspace(String name, @Nullable MultipartFile image, String userId) {
        String res = null;
        try {
            if (image != null) {
                res = fileService.uploadFile(image, "workspaces");
            }
        } catch (Exception e) {
            System.out.println("Error uploading file: " + e.getMessage());
        }
        Workspaces workspaces = new Workspaces();
        workspaces.setUserId(userId);
        workspaces.setName(name);
        workspaces.setImageUrl(res);
        workspaces.setInviteCode(SecureRandomString.generate(10));
        Workspaces newWorkspace = workspacesRepo.save(workspaces);
        membersRepo.save(new Members(userId, newWorkspace.getId(), WorkspaceMemberRole.ADMIN));

        return newWorkspace;
    }

    public List<Workspaces> getWorkspaces(Users user) {
        List<Members> memberships = membersRepo.findByUserId(user.getId());
        List<String> workspaceIds = memberships.stream().map(Members::getWorkspaceId).toList();
        return workspacesRepo.findAllById(workspaceIds);
    }

    public Workspaces updateWorkspace(String workspaceId, @Nullable String name, @Nullable MultipartFile image, Users user) throws Exception {
        Optional<Members> member = membersRepo.findByUserIdAndWorkspaceId(user.getId(), workspaceId);
        if (member.isEmpty()) {
            throw new Exception("Member not found");
        } else if (member.get().getRole() != WorkspaceMemberRole.ADMIN) {
            throw new Exception("Unauthorised");
        }

        Optional<Workspaces> workspace = workspacesRepo.findById(workspaceId);

        if (workspace.isEmpty()) {
            throw new Exception("Failed to find workspace");
        }

        if (name != null) {
            workspace.get().setName(name);
        }

        if (image != null) {
            String fileName = fileService.updateFile(image, workspace.get().getImageUrl(), "workspaces");
            workspace.get().setImageUrl(fileName);
        }

        return workspacesRepo.save(workspace.get());
    }

    public Optional<Workspaces> getWorkspaceById(String workspaceId, Users user) throws Exception {
        Optional<Members> member = membersRepo.findByUserIdAndWorkspaceId(user.getId(), workspaceId);

        if (member.isEmpty()) {
            throw new Exception("Unauthorized");
        } else {
            return workspacesRepo.findById(workspaceId);
        }

    }

    @Transactional
    public void deleteWorkspace(String workspaceId, Users user) throws Exception {
        Optional<Members> member = membersRepo.findByUserIdAndWorkspaceId(user.getId(), workspaceId);

        if (member.isEmpty() || member.get().getRole() != WorkspaceMemberRole.ADMIN) {
            throw new Exception("Unauthorized");
        }
        //Todo: Delete projects, issues, and other related data
        membersRepo.deleteByWorkspaceId(workspaceId);
        workspacesRepo.deleteById(workspaceId);

    }

    public String updateInviteCode(String workspaceId, Users user) throws Exception {
        Optional<Members> member = membersRepo.findByUserIdAndWorkspaceId(user.getId(), workspaceId);

        if (member.isEmpty() || member.get().getRole() != WorkspaceMemberRole.ADMIN) {
            throw new Exception("Unauthorized");
        }

        Optional<Workspaces> workspace = workspacesRepo.findById(workspaceId);
        if (workspace.isEmpty()) {
            throw new Exception("Failed to find workspace");
        }

        String newInviteCode = SecureRandomString.generate(10);

        workspace.get().setInviteCode(newInviteCode);

        workspacesRepo.save(workspace.get());

        return newInviteCode;

    }

    public void addUserToWorkspace(String workspaceId, String inviteCode, Users user) {
        Optional<Workspaces> workspace = workspacesRepo.findById(workspaceId);
        if (workspace.isEmpty() || !workspace.get().getInviteCode().equals(inviteCode)) {
            throw new RuntimeException("Invalid workspace or invite code");
        }

        Optional<Members> existingMember = membersRepo.findByUserIdAndWorkspaceId(user.getId(), workspaceId);
        if (existingMember.isPresent()) {
            throw new RuntimeException("User already a member of this workspace");
        }

        Members newMember = new Members(user.getId(), workspaceId, WorkspaceMemberRole.MEMBER);
        membersRepo.save(newMember);
    }

    public String getWorkspaceName(String workspaceId) {
        Optional<Workspaces> workspace = workspacesRepo.findById(workspaceId);
        if (workspace.isEmpty()) {
            throw new RuntimeException("Workspace not found");
        }
        return workspace.get().getName();
    }

    public AnalyticsDto getWorkspaceAnalytics(String workspaceId, Users user) {
        Optional<Workspaces> workspace = workspacesRepo.findById(workspaceId);

        if (workspace.isEmpty()) {
            throw new RuntimeException("Workspace not found");
        }

        Optional<Members> existingMember = membersRepo.findByUserIdAndWorkspaceId(user.getId(), workspaceId);
        if (existingMember.isEmpty()) {
            throw new RuntimeException("Unauthorized");
        }

        Date date = new Date();
        Date startOfMonth = new Date(date.getYear(), date.getMonth(), 1);
        Date endOfMonth = new Date(date.getYear(), date.getMonth() + 1, 1);
        Date startOfLastMonth = new Date(date.getYear(), date.getMonth() - 1, 1);
        Date endOfLastMonth = new Date(date.getYear(), date.getMonth(), 1);

        List<Task> thisMonthTasks = workspace.get().getTasks().stream().filter(task -> task.getCreatedAt().after(startOfMonth) && task.getCreatedAt().before(endOfMonth)).toList();

        List<Task> lastMonthTasks = workspace.get().getTasks().stream().filter(task -> task.getCreatedAt().after(startOfLastMonth) && task.getCreatedAt().before(endOfLastMonth)).toList();

        Integer taskCount = thisMonthTasks.size();
        Integer taskDifference = taskCount - lastMonthTasks.size();

        List<Task> thisMonthAssignedTasks = thisMonthTasks.stream().filter(task -> task.getAssignee() != null && task.getAssignee().getUserId().equals(user.getId())).toList();

        List<Task> lastMonthAssignedTasks = lastMonthTasks.stream().filter(task -> task.getAssignee() != null && task.getAssignee().getUserId().equals(user.getId())).toList();

        Integer assignedTaskCount = thisMonthAssignedTasks.size();
        Integer assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.size();

        List<Task> thisMonthIncompleteTasks = thisMonthTasks.stream().filter(task -> task.getTaskStatus() != TaskStatus.DONE).toList();

        List<Task> lastMonthIncompleteTasks = lastMonthTasks.stream().filter(task -> task.getTaskStatus() != TaskStatus.DONE).toList();

        Integer incompleteTaskCount = thisMonthIncompleteTasks.size();
        Integer incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.size();

        List<Task> thisMonthCompletedTasks = thisMonthTasks.stream().filter(task -> task.getTaskStatus().equals(TaskStatus.DONE)).toList();

        List<Task> lastMonthCompletedTasks = lastMonthTasks.stream().filter(task -> task.getTaskStatus().equals(TaskStatus.DONE)).toList();

        Integer completedTaskCount = thisMonthCompletedTasks.size();
        Integer completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.size();

        List<Task> thisMonthOverdueTasks = thisMonthTasks.stream().filter(task -> task.getDueDate().before(date) && task.getTaskStatus() != TaskStatus.DONE).toList();

        List<Task> lastMonthOverdueTasks = lastMonthTasks.stream().filter(task -> task.getDueDate().before(date) && task.getTaskStatus() != TaskStatus.DONE).toList();

        Integer overdueTaskCount = thisMonthOverdueTasks.size();
        Integer overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.size();

        return new AnalyticsDto(taskCount, taskDifference, assignedTaskCount, assignedTaskDifference, completedTaskCount, completedTaskDifference, incompleteTaskCount, incompleteTaskDifference, overdueTaskCount, overdueTaskDifference);
    }
}
