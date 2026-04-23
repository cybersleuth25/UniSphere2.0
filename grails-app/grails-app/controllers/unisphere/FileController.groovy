package unisphere

/**
 * FileController - serves uploaded files (images, avatars) from the uploads directory.
 *
 * Without this, all post images and avatars return 404 since the upload directory
 * is not part of the static asset pipeline.
 */
class FileController {

    FileUploadService fileUploadService

    /**
     * Serve a file from the uploads directory.
     * URL: /uploads/{filename}
     */
    def serve() {
        String filename = params.filename
        if (!filename) {
            response.status = 404
            render 'File not found.'
            return
        }

        // Prevent directory traversal attacks
        if (filename.contains('..') || filename.contains('/') || filename.contains('\\')) {
            response.status = 400
            render 'Invalid filename.'
            return
        }

        File file = new File("uploads/${filename}")
        if (!file.exists() || !file.isFile()) {
            response.status = 404
            render 'File not found.'
            return
        }

        // Determine content type from extension
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase()
        String contentType = 'application/octet-stream'
        switch (ext) {
            case 'jpg':
            case 'jpeg':
                contentType = 'image/jpeg'
                break
            case 'png':
                contentType = 'image/png'
                break
            case 'gif':
                contentType = 'image/gif'
                break
            case 'webp':
                contentType = 'image/webp'
                break
        }

        response.contentType = contentType
        response.setHeader('Cache-Control', 'public, max-age=86400')
        response.outputStream << file.bytes
        response.outputStream.flush()
    }
}
