package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.service.FileServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.Optional;

@RestController
@RequestMapping("/image")
@CrossOrigin
public class ImageController {
    private final FileServiceImpl fileService;

    @Autowired
    public ImageController(FileServiceImpl fileService){
        this.fileService = fileService;
    }

    @GetMapping(value = "/{directory}/{name}",produces = MediaType.IMAGE_JPEG_VALUE)
   public ResponseEntity<byte[]> getImage(@PathVariable("directory") String directory, @PathVariable("name") String name){
            try{
                byte[] imageBytes = fileService.downloadFile(directory + "/" + name);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG);

                return ResponseEntity.ok().headers(headers).body(imageBytes);

            } catch (Exception e){
                System.out.println("Failed to fetch image" + e.getMessage());
                return ResponseEntity.internalServerError().body(new byte[0]);
            }
        }
}
