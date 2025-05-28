package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.dto.members.ReturnAllMembersProfileDto;
import com.jira_clone_api.jira_clone_api.dto.members.UpdateMemberDto;
import com.jira_clone_api.jira_clone_api.enums.WorkspaceMemberRole;
import com.jira_clone_api.jira_clone_api.models.Members;
import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.models.Workspaces;
import com.jira_clone_api.jira_clone_api.repository.MembersRepo;
import com.jira_clone_api.jira_clone_api.repository.UserRepo;
import com.jira_clone_api.jira_clone_api.repository.WorkspacesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Service
public class MembersService {

    private final MembersRepo membersRepo;
    private final WorkspacesRepo workspacesRepo;
    private final UserRepo userRepo;

    @Autowired
    public MembersService(MembersRepo membersRepo, WorkspacesRepo workspacesRepo, UserRepo userRepo) {
        this.membersRepo = membersRepo;
        this.workspacesRepo = workspacesRepo;
        this.userRepo = userRepo;
    }

    public List<ReturnAllMembersProfileDto> getAllWorkspaceMembers(String workspaceId, Users user){
        Optional<Members> member = membersRepo.findByUserIdAndWorkspaceId(user.getId(), workspaceId);
        if(member.isEmpty()){
            throw new RuntimeException("Unauthorised");
        }

        Optional<Workspaces> workspace = workspacesRepo.findById(workspaceId);
        if(workspace.isEmpty()){
            throw new RuntimeException("Workspace not found");
        }

        List<Members> members = workspace.get().getMembers();
        List<Users> users = userRepo.findAllById(members.stream().map(Members::getUserId).toList());
        return IntStream.range(0, members.size())
                .mapToObj(ind -> new ReturnAllMembersProfileDto(members.get(ind), users.get(ind)))
                .toList();
    }

    public void removeMember(String memberId, Users user) {
        Optional<Members> member = membersRepo.findById(memberId);

        if (member.isEmpty()) {
            throw new RuntimeException("Member not found");
        }

        Optional<Workspaces> workspace = workspacesRepo.findById(member.get().getWorkspaceId());

        if (workspace.isEmpty()) {
            throw new RuntimeException("Workspace not found");
        }

        if(workspace.get().getMembers().size() == 1){
            throw new RuntimeException("Cannot remove the last member of the workspace");
        }

        // Either the user is the member themselves or the only admin in the workspace
        if(user.getId() == member.get().getUserId() || workspace.get().getMembers().stream().filter(m -> m.getUserId() == user.getId() && m.getRole() == WorkspaceMemberRole.ADMIN).toList().size() == 1) {
            membersRepo.delete(member.get());
        }
        else {
            throw new RuntimeException("Unauthorised");
        }

    }

    public Members updateMember(UpdateMemberDto updateMemberDto, String memberId, Users user) {
        Optional<Members> member = membersRepo.findById(memberId);

        if (member.isEmpty()) {
            throw new RuntimeException("Member not found");
        }

        Optional<Workspaces> workspace = workspacesRepo.findById(member.get().getWorkspaceId());
        if (workspace.isEmpty()) {
            throw new RuntimeException("Workspace not found");
        }

        // Check if the user is an admin of the workspace
        if (workspace.get().getMembers().stream().noneMatch(m -> m.getUserId().equals(user.getId()) && m.getRole() == WorkspaceMemberRole.ADMIN)) {
            throw new RuntimeException("Unauthorised");
        }

        // Cannot demote the only admin of the workspace
        if (workspace.get().getMembers().stream().mapToInt(m -> m.getRole() == WorkspaceMemberRole.ADMIN ? 1 : 0).sum() == 1){
            throw new RuntimeException("Unauthorised");
        }

        // Update the member's role
        member.get().setRole(updateMemberDto.getRole());
        return membersRepo.save(member.get());

    }
}
