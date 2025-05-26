package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.exceptions.FileDownloadException;
import com.jira_clone_api.jira_clone_api.exceptions.FileUploadException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileService {

    String uploadFile(MultipartFile multipartFile, String directory) throws FileUploadException, IOException;

    String updateFile(MultipartFile multipartFile, String name, String directory) throws FileUploadException, IOException;

    byte[] downloadFile(String fileName) throws FileDownloadException, IOException;

    boolean delete(String fileName);
}
