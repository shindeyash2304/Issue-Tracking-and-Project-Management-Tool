package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.models.UserPrincipal;
import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private UserRepo userRepo;

    @Autowired
    public MyUserDetailsService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepo.findByEmail(username);
        if(user==null){
            throw new UsernameNotFoundException("User not found");
        }
        return new UserPrincipal(user);
    }
}
