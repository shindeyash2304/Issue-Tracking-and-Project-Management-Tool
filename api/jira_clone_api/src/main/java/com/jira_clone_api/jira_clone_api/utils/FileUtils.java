package com.jira_clone_api.jira_clone_api.utils;

import java.io.File;

public class FileUtils {

    public static void createFolderIfNotExists(String folderPath) {
        File folder = new File(folderPath);
        if (!folder.exists()) {
            boolean created = folder.mkdirs(); // creates all necessary parent directories
            if (!created) {
                throw new RuntimeException("Failed to create directory: " + folderPath);
            }
        }
    }
}
