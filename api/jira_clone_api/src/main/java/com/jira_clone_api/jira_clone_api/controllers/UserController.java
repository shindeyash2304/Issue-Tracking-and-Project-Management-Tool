package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Users register(@RequestBody Users user){
        return userService.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Optional<Map<String,String>>> login(@RequestBody Users user){
        String token = userService.verify(user);
        Map<String,String> responseBody = new HashMap<>();
        if(token.equals("Authentication failed")){
            return ResponseEntity.status(401).body(Optional.of(responseBody));
        }
        responseBody.put("token", token);
        return ResponseEntity.status(200).body(Optional.of(responseBody));
    }
}
