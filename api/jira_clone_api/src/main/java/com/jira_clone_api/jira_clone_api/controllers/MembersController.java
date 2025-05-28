package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.dto.members.GetAllMembersDto;
import com.jira_clone_api.jira_clone_api.dto.members.ReturnAllMembersProfileDto;
import com.jira_clone_api.jira_clone_api.dto.members.UpdateMemberDto;
import com.jira_clone_api.jira_clone_api.models.Members;
import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.service.MembersService;
import com.jira_clone_api.jira_clone_api.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
@CrossOrigin
public class MembersController {

    private final MembersService membersService;
    private final UserService userService;

    @Autowired
    public MembersController(MembersService membersService, UserService userService) {
        this.membersService = membersService;
        this.userService = userService;
    }

    @PostMapping("")
    public ResponseEntity<List<ReturnAllMembersProfileDto>> getAllWorkspaceMembers(@RequestBody GetAllMembersDto getAllMembersDto, HttpServletRequest request){
        try{
            Users user = userService.getUserByEmail(request);

            List<ReturnAllMembersProfileDto> members = membersService.getAllWorkspaceMembers(getAllMembersDto.getWorkspaceId(), user);

            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(members);
        } catch (Exception e) {
            if(e.getMessage().equals("Unauthorised")) {
                return ResponseEntity.status(403).body(null);
            } else if (e.getMessage().equals("Workspace not found")) {
                return ResponseEntity.status(404).body(null);
            } else {
                System.out.println(e.getMessage());
                return ResponseEntity.badRequest().body(null);
            }
        }
    }

    @DeleteMapping("/{memberId}")
public ResponseEntity<String> removeMember(@PathVariable String memberId, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            membersService.removeMember(memberId, user);
            return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body("Member removed successfully: " + memberId);
        } catch (Exception e) {
            if (e.getMessage().equals("Unauthorised")) {
                return ResponseEntity.status(403).body("Unauthorized action");
            } else if (e.getMessage().equals("Member not found")) {
                return ResponseEntity.status(404).body("Member not found");
            } else {
                System.out.println(e.getMessage());
                return ResponseEntity.badRequest().body("Error removing member");
            }
        }
    }

    @PatchMapping("/{memberId}")
    public ResponseEntity<Members> updateMember(@RequestBody UpdateMemberDto updateMemberDto, @PathVariable String memberId, HttpServletRequest request) {
        try {
            Users user = userService.getUserByEmail(request);
            Members updatedMember = membersService.updateMember(updateMemberDto, memberId, user);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(updatedMember);
        } catch (Exception e) {
            if (e.getMessage().equals("Unauthorised")) {
                return ResponseEntity.status(403).body(null);
            } else if (e.getMessage().equals("Member not found")) {
                return ResponseEntity.status(404).body(null);
            } else {
                System.out.println(e.getMessage());
                return ResponseEntity.badRequest().body(null);
            }
        }
    }
}
