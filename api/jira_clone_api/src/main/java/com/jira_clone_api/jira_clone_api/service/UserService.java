package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.repository.UserRepo;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Objects;

@Service
public class UserService {

    private UserRepo userRepo;
    private AuthenticationManager authManager;
    private JWTService jwtService;

    @Autowired
    public UserService(UserRepo userRepo, AuthenticationManager authManager, JWTService jwtService) {
        this.userRepo = userRepo;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Users register(Users user){
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public Cookie verify(String email, String password) throws Exception {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(email);
            Cookie c = new Cookie("CWA-JIRA-CLONE-SESSION", token);
            c.setPath("/");
            c.setHttpOnly(true);
            c.setMaxAge(60 * 60 * 24 * 30); // 30 days
            c.setAttribute("SameSite", "None");
            c.setSecure(true);
            return c;
        } else {
            throw new Exception("Authentication failed");
        }
    }

public Users getUserByEmail(HttpServletRequest request) {
            Cookie[] cookies = request.getCookies();
            Cookie auth = (cookies != null) ? Arrays.stream(cookies).filter(cookie -> Objects.equals(cookie.getName(), "CWA-JIRA-CLONE-SESSION")).findFirst().orElse(null) : null;
            String token = null;
            String email = null;
            if (auth != null) {
                token = auth.getValue();
                email = jwtService.extractUserName(token);
            }
            return userRepo.findByEmail(email);
        }
}
