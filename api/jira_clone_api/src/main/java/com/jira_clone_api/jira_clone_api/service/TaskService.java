package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.dto.task.CreateTaskDto;
import com.jira_clone_api.jira_clone_api.dto.task.GetTaskDto;
import com.jira_clone_api.jira_clone_api.models.*;
import com.jira_clone_api.jira_clone_api.repository.MembersRepo;
import com.jira_clone_api.jira_clone_api.repository.ProjectRepo;
import com.jira_clone_api.jira_clone_api.repository.TaskRepo;
import com.jira_clone_api.jira_clone_api.repository.WorkspacesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepo taskRepo;
    private final ProjectRepo projectRepo;
    private final WorkspacesRepo workspacesRepo;
    private final MembersRepo membersRepo;

    @Autowired
    public TaskService(TaskRepo taskRepo, ProjectRepo projectRepo, WorkspacesRepo workspacesRepo, MembersRepo membersRepo) {
        this.taskRepo = taskRepo;
        this.projectRepo = projectRepo;
        this.workspacesRepo = workspacesRepo;
        this.membersRepo = membersRepo;
    }

    public Task createTask(CreateTaskDto createTaskDto, Users user) throws Exception {
        Optional<Workspaces> workspace = workspacesRepo.findById(createTaskDto.getWorkspaceId());

        if (workspace.isEmpty()) {
            throw new Exception("WorkspaceNotFound");
        }

        if (workspace.get().getProjects().stream().noneMatch(project -> project.getId().equals(createTaskDto.getProjectId()))) {
            throw new Exception("Project not found");
        }

        if (workspace.get().getMembers().stream().noneMatch(member -> member.getUserId().equals(user.getId()))) {
            throw new Exception("User not part of workspace");
        }

        Project project = workspace.get().getProjects().stream().filter(thisProject -> thisProject.getId().equals(createTaskDto.getProjectId())).toList().get(0);

        Task highestPositionTask = project.getTasks().stream().min((a, b) -> Integer.compare(a.getPosition(), b.getPosition())).orElse(null);

        Task task = getTask(createTaskDto, highestPositionTask);

        return taskRepo.save(task);
    }

    public List<Task> getTasks(GetTaskDto getTaskDto, Users user) throws Exception {
        Optional<Members> member = membersRepo.findByUserIdAndWorkspaceId(user.getId(), getTaskDto.getWorkspaceId());

        if (member.isEmpty()) {
            throw new Exception("Unauthorized");
        }

        List<Task> result = taskRepo.findTasksByFilters(getTaskDto.getWorkspaceId(), getTaskDto.getProjectId(), getTaskDto.getAssigneeId(), getTaskDto.getTaskStatus(), getTaskDto.getSearch(), getTaskDto.getDueDate());

        return result;

    }

    private static Task getTask(CreateTaskDto createTaskDto, Task highestPositionTask) {
        Integer newPosition = highestPositionTask != null ? highestPositionTask.getPosition() + 1000 : 1000;

        Task task = new Task();
        task.setTaskStatus(createTaskDto.getTaskStatus());
        task.setName(createTaskDto.getName());
        task.setDescription(createTaskDto.getDescription());
        task.setAssigneeId(createTaskDto.getAssigneeId());
        task.setWorkspaceId(createTaskDto.getWorkspaceId());
        task.setDueDate(createTaskDto.getDueDate());
        task.setProjectId(createTaskDto.getProjectId());
        task.setPosition(newPosition);
        return task;
    }
}
