package com.jira_clone_api.jira_clone_api.service;

import com.jira_clone_api.jira_clone_api.exceptions.FileDownloadException;
import com.jira_clone_api.jira_clone_api.utils.FileUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.UUID;

@Service
@Slf4j
public class FileServiceImpl implements FileService {

    private final String bucketName;
    private final S3AsyncClient s3Client;

    @Autowired
    public FileServiceImpl(@Value("${aws.bucket.name}") String bucketName, S3AsyncClient s3Client) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    @Override
    public String uploadFile(MultipartFile multipartFile, String directory) throws IOException {
        String extension = FilenameUtils.getExtension(multipartFile.getOriginalFilename());
        String fileName = directory + "/" + UUID.randomUUID().toString() + "." + extension;
        FileUtils.createFolderIfNotExists(directory);
        File file = new File(fileName);
        try (FileOutputStream fileOutputStream = new FileOutputStream(file)){
            fileOutputStream.write(multipartFile.getBytes());
        }

        try{
        PutObjectResponse putObjectResponse = this.s3Client.putObject(req -> req.bucket(this.bucketName).key(fileName), AsyncRequestBody.fromFile(Paths.get(file.getPath()))).join();
        } catch (Exception e){
            System.out.println(e);
        }
        file.delete();

        return fileName;
    }

    @Override
    public String updateFile(MultipartFile multipartFile, @Nullable String name, String directory) throws IOException {
        String extension = FilenameUtils.getExtension(multipartFile.getOriginalFilename());
        String fileName = name != null ? name : directory + "/" + UUID.randomUUID().toString() + "." + extension;

        FileUtils.createFolderIfNotExists(directory);
        File file = new File(fileName);
        try (FileOutputStream fileOutputStream = new FileOutputStream(file)){
            fileOutputStream.write(multipartFile.getBytes());
        }

        try{
            PutObjectResponse putObjectResponse = this.s3Client.putObject(req -> req.bucket(this.bucketName).key(fileName), AsyncRequestBody.fromFile(Paths.get(file.getPath()))).join();
        } catch (Exception e){
            System.out.println(e);
        }
        file.delete();
        return fileName;
    }

    @Override
    public byte[] downloadFile(String fileName) throws FileDownloadException, IOException {
        if (bucketIsEmpty()) {
            throw new FileDownloadException("Requested bucket does not exist or is empty");
        }

        GetObjectResponse getObjectResponse = this.s3Client.getObject(req -> req
                .bucket(this.bucketName)
                .key(fileName)
                ,AsyncResponseTransformer.toFile(Paths.get(fileName))
        ).join();

        var imgFile = new File(fileName);
        try (var inputStream = Files.newInputStream(imgFile.toPath())) {
            return StreamUtils.copyToByteArray(inputStream);
        }
    }

    @Override
    public boolean delete(String fileName) {
        File file = Paths.get(fileName).toFile();
        if (file.exists()) {
            file.delete();
            return true;
        }
        return false;
    }

    private boolean bucketIsEmpty() {
        ListObjectsV2Request listObjectsRequest = ListObjectsV2Request.builder().bucket(this.bucketName).build();
        return s3Client.listObjectsV2(listObjectsRequest).join().contents().isEmpty();
    }

    private String generateFileName(MultipartFile multiPart) {
        return new Date().getTime() + "-" + multiPart.getOriginalFilename().replace(" ", "_");
    }
}
