'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FileList } from '@/components/dashboard/file-list';
import { FileTypeBreakdownChart } from '@/components/dashboard/file-type-breakdown-chart';
import { FileUploader } from '@/components/dashboard/file-uploader';
import { FilesTable } from '@/components/dashboard/files-table';
import { FileItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [files, setFiles] = React.useState<FileItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Check for authentication
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch initial files
    fetchFiles();
  }, [router]);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch files');
      
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

const handleAddFiles = async (newFiles: File[]): Promise<void> => {
  try {
    // Convert File[] to FileItem[]
    const fileItems: FileItem[] = newFiles.map(file => ({
      id: crypto.randomUUID(), // Generate a temporary ID
      file: file,
      status: 'pending',
      uploadDate: new Date()
    }));

    setFiles(prevFiles => [...prevFiles, ...fileItems]);
    // Additional API call to upload files would go here
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to upload files",
      variant: "destructive"
    });
  }
};

  const handleRetry = async (fileId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/files/${fileId}/retry`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Retry failed');

      toast({
        title: "Success",
        description: "File processing restarted",
      });

      await fetchFiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry file processing",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (fileId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');

      setFiles(files.filter(file => file.id !== fileId));
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Upload your files and get AI-powered insights.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-[300px,1fr]">
        <div className="space-y-6">
          <FileTypeBreakdownChart files={files} />
        </div>
        <div className="space-y-6">
          <FileUploader onFilesAdded={handleAddFiles} />
          <FilesTable 
            files={files} 
            onRetry={handleRetry} 
            onDelete={handleDelete} 
          />
        </div>
      </div>
    </div>
  );
}