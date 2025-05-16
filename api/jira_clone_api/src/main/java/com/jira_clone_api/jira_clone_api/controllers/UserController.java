package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.service.UserService;
import com.jira_clone_api.jira_clone_api.utils.HttpUtils;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
    public ResponseEntity<Users> register(@RequestBody Users user){
        try{
            Users createdUser = userService.register(user);

            return ResponseEntity.status(201).body(createdUser);
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body(null);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody Users user){
        Map<String,String> responseBody = new HashMap<>();
        try{
            Cookie c = userService.verify(user.getEmail(), user.getPassword());

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.SET_COOKIE, HttpUtils.cookieToHeaderString(c));

            responseBody.put("succcess", "true");
            responseBody.put("message", "Login successful");
            return ResponseEntity.status(200).headers(headers).body(responseBody);

        } catch (Exception e) {
            responseBody.put("success", "false");
            responseBody.put("message", e.getMessage());
            return ResponseEntity.status(401).body(responseBody);
        }


    }
        @GetMapping("/test")
        public ResponseEntity<String> test() {
            return ResponseEntity.ok("Test successful");
        }
}
