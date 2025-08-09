'use client';

import * as React from 'react';
import { FileUploader } from '@/components/dashboard/file-uploader';
import { FilesTable } from '@/components/dashboard/files-table';
import { type FileItem } from '@/types';
import { summarizeFile } from '@/ai/flows/summarize-file';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { FileTypeBreakdownChart } from '@/components/dashboard/file-type-breakdown-chart';

export default function DashboardPage() {
  const [files, setFiles] = React.useState<FileItem[]>([]);
  const { toast } = useToast();

  const updateFileStatus = (id: string, status: FileItem['status'], data?: Partial<Omit<FileItem, 'id' | 'file'>>) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === id ? { ...f, status, ...data } : f))
    );
  };

  const handleAddFiles = (newFiles: File[]) => {
    const newFileItems: FileItem[] = newFiles.map((file) => ({
      id: uuidv4(),
      file,
      status: 'pending',
      uploadDate: new Date(),
    }));
    setFiles((prevFiles) => [...newFileItems, ...prevFiles]);
  };

  const processFile = async (item: FileItem) => {
    try {
      // 1. Uploading
      updateFileStatus(item.id, 'uploading');
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload

      // 2. Processing
      updateFileStatus(item.id, 'processing');
      const text = await item.file.text();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate processing

      // 3. Summarizing
      updateFileStatus(item.id, 'summarizing');
      const result = await summarizeFile({ text });

      if (result.summary) {
        updateFileStatus(item.id, 'complete', { summary: result.summary });
      } else {
        throw new Error('Summarization failed.');
      }
    } catch (e: any) {
      const error = e.message || 'An unknown error occurred.';
      updateFileStatus(item.id, 'error', { error });
      toast({
        variant: 'destructive',
        title: `Error processing ${item.file.name}`,
        description: error,
      });
    }
  };

  React.useEffect(() => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length > 0) {
      pendingFiles.forEach(processFile);
    }
  }, [files]);
  
  const handleRetry = (id: string) => {
    const fileToRetry = files.find(f => f.id === id);
    if (fileToRetry) {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'pending', error: undefined } : f));
    }
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Upload your files and get AI-powered insights.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            <FileUploader onFilesAdded={handleAddFiles} />
            <FilesTable files={files} onRetry={handleRetry} onDelete={handleDelete} />
        </div>
        <div className="space-y-8">
            <FileTypeBreakdownChart files={files} />
        </div>
      </div>
    </div>
  );
}
