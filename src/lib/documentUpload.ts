import { supabase } from './supabaseClient';

export interface UploadedDocument {
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export class DocumentUploadService {
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Upload a document to Supabase Storage
   */
  static async uploadDocument(
    file: File,
    category: 'partner' | 'driver' | 'corporate',
    userId?: string
  ): Promise<UploadedDocument> {
    // Validate file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only PDF, JPG, PNG, and DOC files are allowed.');
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit.');
    }

    // Generate unique file name
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${category}/${userId || 'anonymous'}/${timestamp}_${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload document: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    };
  }

  /**
   * Upload multiple documents
   */
  static async uploadMultipleDocuments(
    files: FileList | File[],
    category: 'partner' | 'driver' | 'corporate',
    userId?: string
  ): Promise<UploadedDocument[]> {
    const uploadPromises = Array.from(files).map(file =>
      this.uploadDocument(file, category, userId)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  /**
   * Delete a document from storage
   */
  static async deleteDocument(documentUrl: string): Promise<void> {
    // Extract file path from URL
    const urlParts = documentUrl.split('/');
    const fileName = urlParts.slice(-3).join('/'); // Get last 3 parts (category/userId/filename)

    const { error } = await supabase.storage
      .from('documents')
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Save document metadata to database
   */
  static async saveDocumentMetadata(
    applicationId: string,
    applicationType: 'partner_applications' | 'driver_applications' | 'corporate_accounts',
    documents: UploadedDocument[]
  ): Promise<void> {
    const { error } = await supabase
      .from(applicationType)
      .update({ 
        documents: documents,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      console.error('Metadata save error:', error);
      throw new Error(`Failed to save document metadata: ${error.message}`);
    }
  }

  /**
   * Get signed URL for private document access
   */
  static async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error('Signed URL error:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }

    return data.signedUrl;
  }

  /**
   * Validate document requirements for different application types
   */
  static validateDocumentRequirements(
    applicationType: 'partner' | 'driver' | 'corporate',
    documents: UploadedDocument[]
  ): { isValid: boolean; missingDocuments: string[] } {
    const requirements: Record<string, string[]> = {
      partner: ['Vehicle Registration', 'Insurance Certificate', 'Owner ID'],
      driver: ['Driving License', 'National ID', 'Good Conduct Certificate'],
      corporate: ['Business Registration', 'Tax Compliance Certificate', 'Company Profile']
    };

    const required = requirements[applicationType] || [];
    const missingDocuments: string[] = [];

    // This is a simplified check - in production, you'd want more sophisticated validation
    if (documents.length < required.length) {
      missingDocuments.push(...required);
    }

    return {
      isValid: missingDocuments.length === 0,
      missingDocuments
    };
  }
}

/**
 * React hook for document upload with progress tracking
 */
export function useDocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadDocuments = async (
    files: FileList | File[],
    category: 'partner' | 'driver' | 'corporate',
    userId?: string
  ): Promise<UploadedDocument[] | null> => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const totalFiles = files.length;
      const uploadedDocs: UploadedDocument[] = [];

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const doc = await DocumentUploadService.uploadDocument(file, category, userId);
        uploadedDocs.push(doc);
        setProgress(((i + 1) / totalFiles) * 100);
      }

      setUploading(false);
      return uploadedDocs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setUploading(false);
      return null;
    }
  };

  return {
    uploadDocuments,
    uploading,
    progress,
    error
  };
}

// Import React for the hook
import { useState } from 'react';