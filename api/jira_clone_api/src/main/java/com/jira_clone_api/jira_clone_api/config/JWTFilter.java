package com.jira_clone_api.jira_clone_api.config;

import com.jira_clone_api.jira_clone_api.service.JWTService;
import com.jira_clone_api.jira_clone_api.service.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Objects;

@Component
public class JWTFilter extends OncePerRequestFilter {

    private JWTService jwtService;
    private ApplicationContext context;

    @Autowired
    public JWTFilter(JWTService jwtService, ApplicationContext context) {
        this.jwtService = jwtService;
        this.context = context;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException{
        String path = request.getRequestURI();
        return path.equals("/login") || path.equals("/register") || path.equals("/v3/api-docs") || path.startsWith("/image") || path.startsWith("/h2-console");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        Cookie auth = Arrays.stream(cookies).filter(cookie -> Objects.equals(cookie.getName(), "CWA-JIRA-CLONE-SESSION")).findFirst().orElse(null);
        String token = null;
        String username = null;
         if(auth!=null)
         {
             token = auth.getValue();
             username = jwtService.extractUserName(token);
         }
         if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){

             UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);

             if(jwtService.validateToken(token, userDetails)){
                 UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                 authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                 SecurityContextHolder.getContext().setAuthentication(authToken);
             }
         }
         filterChain.doFilter(request,response);
    }
}
