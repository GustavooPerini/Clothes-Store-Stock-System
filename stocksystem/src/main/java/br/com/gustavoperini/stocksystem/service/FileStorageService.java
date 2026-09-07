package br.com.gustavoperini.stocksystem.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service 
public class FileStorageService {

    private final Path storageLocation = Paths.get("uploads/products");

    // Creating the image directory
    public FileStorageService() {
        try {
            Files.createDirectories(storageLocation);
        }
        catch (IOException e) {
            throw new RuntimeException("Could not initialize storage folder", e);
        }
    }

    // Method to save an image
    public String saveFile(MultipartFile file) {

        // Verify if the file is empty
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty!");
        }

        // Validate the MIME type
        String contentType = file.getContentType();
        if(contentType == null || (
                !contentType.equalsIgnoreCase("image/jpeg") &&
                !contentType.equalsIgnoreCase("image/png") &&
                !contentType.equalsIgnoreCase("image/webp"))
        ) {
            throw new IllegalArgumentException("Only JPEG, PNG, and WEBP images are supported!");
        }

        // Extract the original file extension
        String orinalFileName = file.getOriginalFilename();
        String extension = "";
        if(orinalFileName != null && orinalFileName.contains(".")) {
            extension = orinalFileName.substring(orinalFileName.lastIndexOf(".")).toLowerCase();
        }
        else {
            extension = ".jpg";
        }

        // Generate an unique name using UUID
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save the file bytes to disk
        try {
            Path targetLocation = this.storageLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return uniqueFilename;
        }
        catch(IOException e) {
            throw new RuntimeException("Failed to store file " + uniqueFilename, e);
        }
    }

    public void deleteFile(String filename) {
        if(filename == null || filename.isBlank()) {
            return;
        }
        try {
            Path filePath = this.storageLocation.resolve(filename).normalize();
            Files.deleteIfExists(filePath);
        }
        catch(IOException e) {
            throw new RuntimeException("Could not delete file: " + filename);
        }
    }
}
