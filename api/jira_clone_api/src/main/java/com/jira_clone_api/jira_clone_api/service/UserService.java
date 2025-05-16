package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.repository.UserRepo;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JWTService jwtService;

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
            c.setAttribute("SameSite", "Strict");
//            c.setSecure(true);
            return c;
        } else {
            throw new Exception("Authentication failed");
        }
    }
}
