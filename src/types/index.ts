export interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'processing' | 'summarizing' | 'complete' | 'error';
  summary?: string;
  error?: string;
  uploadDate?: Date;
}
