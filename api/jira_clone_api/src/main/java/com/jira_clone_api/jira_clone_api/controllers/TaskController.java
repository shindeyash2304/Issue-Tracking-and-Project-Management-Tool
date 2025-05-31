package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.dto.task.CreateTaskDto;
import com.jira_clone_api.jira_clone_api.dto.task.GetTaskDto;
import com.jira_clone_api.jira_clone_api.models.Task;
import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.service.TaskService;
import com.jira_clone_api.jira_clone_api.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    @Autowired
    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @PostMapping("")
    public ResponseEntity<Task> createTask(@RequestBody CreateTaskDto createTaskDto, HttpServletRequest request) {
        try {
            System.out.println(createTaskDto);
            Users user = userService.getUserByEmail(request);
            Task task = taskService.createTask(createTaskDto, user);
            return ResponseEntity.ok().body(task);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("")
    public ResponseEntity<List<Task>> getTasks(GetTaskDto getTaskDto, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            return ResponseEntity.ok().body(taskService.getTasks(getTaskDto, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
