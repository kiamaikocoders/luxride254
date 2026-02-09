import { useState, useRef } from 'react';
import { FileText, X, Image as ImageIcon, Upload } from 'lucide-react';

interface Category {
  key: string;
  label: string;
  description: string;
  accept?: string;
  maxFiles?: number;
  required?: boolean;
}

interface CategorizedFileUploadProps {
  categories: Category[];
  onFilesChange?: (files: { [category: string]: File[] }) => void;
  maxSize?: number; // in bytes
}

export function CategorizedFileUpload({
  categories,
  onFilesChange,
  maxSize = 10 * 1024 * 1024, // 10MB default
}: CategorizedFileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<{ [category: string]: File[] }>({});
  const [errors, setErrors] = useState<{ [category: string]: string[] }>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (categoryKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const category = categories.find((c) => c.key === categoryKey);
    if (!category) return;

    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // Check max files limit
    const existingFiles = selectedFiles[categoryKey] || [];
    const totalFiles = existingFiles.length + files.length;
    const maxFiles = category.maxFiles || 10;

    if (totalFiles > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} file(s) allowed for ${category.label}`);
    }

    files.forEach((file) => {
      // Check file size
      if (file.size > maxSize) {
        newErrors.push(`${file.name} exceeds ${maxSize / 1024 / 1024}MB limit`);
        return;
      }

      // Check file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = (category.accept || '.pdf,.jpg,.jpeg,.png')
        .split(',')
        .map((ext) => ext.replace('.', '').toLowerCase());
      
      if (!extension || !allowedExtensions.includes(extension)) {
        newErrors.push(`${file.name} is not an allowed file type for ${category.label}`);
        return;
      }

      validFiles.push(file);
    });

    setErrors((prev) => ({ ...prev, [categoryKey]: newErrors }));

    if (validFiles.length > 0) {
      const updatedFiles = {
        ...selectedFiles,
        [categoryKey]: [...existingFiles, ...validFiles],
      };
      setSelectedFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    }
  };

  const removeFile = (categoryKey: string, index: number) => {
    const updatedFiles = {
      ...selectedFiles,
      [categoryKey]: (selectedFiles[categoryKey] || []).filter((_, i) => i !== index),
    };
    setSelectedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Reset file input
    if (fileInputRefs.current[categoryKey]) {
      fileInputRefs.current[categoryKey]!.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryFiles = selectedFiles[category.key] || [];
        const categoryErrors = errors[category.key] || [];

        return (
          <div key={category.key} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {category.label}
                {category.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <p className="text-xs text-gray-500 mb-2">{category.description}</p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-400 transition-colors">
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600">
                  <label htmlFor={`file-${category.key}`} className="cursor-pointer">
                    <span className="font-medium text-yellow-400 hover:text-yellow-300">
                      Choose Files
                    </span>{' '}
                    or drag and drop
                  </label>
                  <input
                    ref={(el) => (fileInputRefs.current[category.key] = el)}
                    id={`file-${category.key}`}
                    type="file"
                    multiple={!category.maxFiles || category.maxFiles > 1}
                    className="hidden"
                    accept={category.accept || '.pdf,.jpg,.jpeg,.png'}
                    onChange={(e) => handleFileChange(category.key, e)}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {category.accept || 'PNG, JPG, PDF'} up to {maxSize / 1024 / 1024}MB
                  {category.maxFiles && category.maxFiles > 1 && ` (Max ${category.maxFiles} files)`}
                </p>
              </div>
            </div>

            {/* Error Messages */}
            {categoryErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                {categoryErrors.map((error, index) => (
                  <p key={index} className="text-xs text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            )}

            {/* File Preview List */}
            {categoryFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">
                  Selected ({categoryFiles.length}
                  {category.maxFiles && ` / ${category.maxFiles}`})
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {categoryFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex-shrink-0 text-gray-400">
                          {getFileIcon(file.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(category.key, index)}
                        className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
