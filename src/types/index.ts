export interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'processing' | 'summarizing' | 'complete' | 'error';
  summary?: string;
  error?: string;
  uploadDate?: Date;
  previewUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  lastLogin: Date;
}
