package com.jira_clone_api.jira_clone_api.controllers;

import com.jira_clone_api.jira_clone_api.service.FileServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/image")
@CrossOrigin
public class ImageController {
    private final FileServiceImpl fileService;
    private static final MediaType MEDIA_TYPE_SVG = MediaType.parseMediaType("image/svg+xml");

    @Autowired
    public ImageController(FileServiceImpl fileService){
        this.fileService = fileService;
    }

@GetMapping(value = "/{directory}/{name}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, "image/svg+xml"})
   public ResponseEntity<byte[]> getImage(@PathVariable("directory") String directory, @PathVariable("name") String name){
            try{
                byte[] imageBytes = fileService.downloadFile(directory + "/" + name);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType((name.endsWith("jpg") || name.endsWith("jpeg")) ? MediaType.IMAGE_JPEG : name.endsWith("png") ? MediaType.IMAGE_PNG : MEDIA_TYPE_SVG);

                return ResponseEntity.ok().headers(headers).body(imageBytes);

            } catch (Exception e){
                System.out.println("Failed to fetch image" + e.getMessage());
                return ResponseEntity.internalServerError().body(new byte[0]);
            }
        }
}
