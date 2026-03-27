package unisphere

import grails.config.Config
import grails.core.support.GrailsConfigurationAware
import org.springframework.web.multipart.MultipartFile

/**
 * FileUploadService - handles file uploads for avatars and post images.
 *
 * PHP origin: upload-avatar.php (avatar upload), api.php (post image upload)
 */
class FileUploadService implements GrailsConfigurationAware {

    String uploadDirectory
    long maxAvatarSize
    long maxPostImageSize
    List<String> allowedTypes

    @Override
    void setConfiguration(Config config) {
        uploadDirectory = config.getProperty('unisphere.upload.directory', String, 'uploads/')
        maxAvatarSize = config.getProperty('unisphere.upload.maxAvatarSize', Long, 2097152L)
        maxPostImageSize = config.getProperty('unisphere.upload.maxPostImageSize', Long, 5242880L)
        allowedTypes = config.getProperty('unisphere.upload.allowedTypes', List, ['image/jpeg', 'image/png', 'image/gif'])
    }

    /**
     * Upload an avatar file.
     * PHP equivalent: upload-avatar.php
     *
     * @return filepath if successful, null otherwise
     */
    String uploadAvatar(MultipartFile file) {
        if (!file || file.empty) return null

        if (!allowedTypes.contains(file.contentType)) {
            return null
        }

        if (file.size > maxAvatarSize) {
            return null
        }

        return saveFile(file, 'avatar_')
    }

    /**
     * Upload a post image.
     * PHP equivalent: api.php POST image handling
     *
     * @return filepath if successful, null otherwise
     */
    String uploadPostImage(MultipartFile file) {
        if (!file || file.empty) return null

        if (!allowedTypes.contains(file.contentType)) {
            return null
        }

        if (file.size > maxPostImageSize) {
            return null
        }

        return saveFile(file, 'postimg_')
    }

    /**
     * Save file to the upload directory.
     * Generates a unique filename similar to PHP's uniqid().
     */
    private String saveFile(MultipartFile file, String prefix) {
        // Ensure upload directory exists
        File uploadDir = new File(uploadDirectory)
        if (!uploadDir.exists()) {
            uploadDir.mkdirs()
        }

        // Generate unique filename (matching PHP's uniqid pattern)
        String extension = getFileExtension(file.originalFilename)
        String uniqueId = "${System.currentTimeMillis()}${new Random().nextInt(99999)}"
        String filename = "${prefix}${uniqueId}.${extension}"
        String destination = "${uploadDirectory}${filename}"

        try {
            File destFile = new File(destination)
            file.transferTo(destFile)
            return destination
        } catch (Exception e) {
            log.error("Failed to upload file: ${e.message}", e)
            return null
        }
    }

    /**
     * Extract file extension from filename.
     */
    private String getFileExtension(String filename) {
        if (!filename || !filename.contains('.')) return 'jpg'
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()
    }
}
