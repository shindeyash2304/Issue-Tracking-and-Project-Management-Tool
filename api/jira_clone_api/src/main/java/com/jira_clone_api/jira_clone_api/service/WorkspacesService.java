package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.enums.WorkspaceMemberRole;
import com.jira_clone_api.jira_clone_api.models.Members;
import com.jira_clone_api.jira_clone_api.models.Users;
import com.jira_clone_api.jira_clone_api.models.Workspaces;
import com.jira_clone_api.jira_clone_api.repository.MembersRepo;
import com.jira_clone_api.jira_clone_api.repository.WorkspacesRepo;

import com.jira_clone_api.jira_clone_api.utils.SecureRandomString;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class WorkspacesService {

    private final WorkspacesRepo workspacesRepo;
    private final FileServiceImpl fileService;
    private final MembersRepo membersRepo;

    @Autowired
    public WorkspacesService(WorkspacesRepo workspacesRepo, FileServiceImpl fileService, MembersRepo membersRepo) {
        this.workspacesRepo = workspacesRepo;
        this.fileService = fileService;
        this.membersRepo = membersRepo;
    }

    @Transactional
    public Workspaces createWorkspace(String name, @Nullable MultipartFile image, String userId){
        String res = null;
        try {
            if(image!=null){
            res = fileService.uploadFile(image, "workspaces");
            }
        } catch (Exception e) {
            System.out.println("Error uploading file: " + e.getMessage());
        }
        Workspaces workspaces = new Workspaces();
        workspaces.setUserId(userId);
        workspaces.setName(name);
        workspaces.setImageUrl(res!=null ? res : null);
        workspaces.setInviteCode(SecureRandomString.generate(10));
        Workspaces newWorkspace =  workspacesRepo.save(workspaces);
        membersRepo.save(new Members(userId, newWorkspace.getId(), WorkspaceMemberRole.ADMIN));

        return newWorkspace;
    }

    public List<Workspaces> getWorkspaces(Users user){
    List<Members> memberships = membersRepo.findByUserId(user.getId());
List<String> workspaceIds = memberships.stream().map(Members::getWorkspaceId).toList();
    return workspacesRepo.findAllById(workspaceIds);
    }


}
