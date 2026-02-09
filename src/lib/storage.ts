import { supabase } from "@/lib/supabaseClient";

export type UploadedFile = {
  path: string;
  publicUrl?: string;
};

// Helper function to get MIME type from file extension
function getMimeTypeFromFile(file: File): string {
  // If file already has a valid MIME type, use it
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }

  // Otherwise, determine from extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return mimeTypes[extension || ''] || 'application/octet-stream';
}

// Helper function to validate file type
function validateFileType(file: File): boolean {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const fileType = getMimeTypeFromFile(file);
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];

  // Check both MIME type and extension
  return allowedTypes.includes(fileType) || (extension ? allowedExtensions.includes(extension) : false);
}

export async function uploadFilesToApplicationsBucket(
  files: File[],
  folderPrefix: string
): Promise<UploadedFile[]> {
  const results: UploadedFile[] = [];
  if (!files || files.length === 0) return results;

  const timestamp = Date.now();
  for (const file of files) {
    // Validate file type
    if (!validateFileType(file)) {
      throw new Error(`File type not supported: ${file.name}. Please upload PDF, JPG, PNG, or DOC files only.`);
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File too large: ${file.name}. Maximum file size is 10MB.`);
    }

    // Sanitize file name to remove problematic characters
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    // Ensure folderPrefix doesn't have trailing slashes and path is clean
    const cleanFolderPrefix = folderPrefix.replace(/\/+$/, '').replace(/^\/+/, '');
    const path = `${cleanFolderPrefix}/${timestamp}-${sanitizedName}`;
    
    try {
      // Create a new File object with correct MIME type if needed
      let fileToUpload = file;
      const detectedMimeType = getMimeTypeFromFile(file);
      if (file.type === 'application/octet-stream' && detectedMimeType !== 'application/octet-stream') {
        // Create a new File with the correct MIME type
        fileToUpload = new File([file], file.name, { type: detectedMimeType });
      }

      const { data, error } = await supabase.storage.from("applications").upload(path, fileToUpload, {
        upsert: false,
        cacheControl: "3600",
        contentType: detectedMimeType,
      });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      // Get signed URL for private bucket access (since bucket is not public)
      const { data: signedUrlData } = await supabase.storage
        .from("applications")
        .createSignedUrl(path, 3600);
      
      results.push({ 
        path, 
        publicUrl: signedUrlData?.signedUrl 
      });
    } catch (err: any) {
      console.error('Error uploading file:', err);
      throw new Error(`Failed to upload ${file.name}: ${err.message || 'Unknown error'}`);
    }
  }
  return results;
}


