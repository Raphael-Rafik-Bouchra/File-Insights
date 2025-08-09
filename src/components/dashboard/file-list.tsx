'use client';

import * as React from 'react';
import { files } from '@/lib/api/files';
import { webSocketService } from '@/lib/websocket';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileUploader } from './file-uploader';
import {
  ArrowUpDown,
  Download,
  Eye,
  Loader2,
  RefreshCw,
  Trash2,
} from 'lucide-react';

interface FileListProps {
  initialFiles?: any[];
}

export function FileList({ initialFiles = [] }: FileListProps) {
  const [fileList, setFileList] = React.useState(initialFiles);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const { toast } = useToast();

  const fetchFiles = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await files.list({ page, limit: 10 }, token);
      setFileList(prev => page === 1 ? response.items : [...prev, ...response.items]);
      setHasMore(response.items.length === 10);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch files',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, toast]);

  React.useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    webSocketService.onFileStatusUpdate(({ fileId, status, error }) => {
      setFileList(prev =>
        prev.map(file =>
          file.id === fileId
            ? { ...file, status, error: error || file.error }
            : file
        )
      );

      if (status === 'completed') {
        toast({
          title: 'File processed',
          description: `File processing completed successfully`,
        });
      } else if (status === 'failed') {
        toast({
          title: 'Processing failed',
          description: error || 'File processing failed',
          variant: 'destructive',
        });
      }
    });

    return () => {
      webSocketService.removeFileStatusListener();
    };
  }, [toast]);

  const handleFilesAdded = async (newFiles: File[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: 'Error',
          description: 'Please login to upload files',
          variant: 'destructive',
        });
        return;
      }

      for (const file of newFiles) {
        const response = await files.upload(file, token);
        setFileList(prev => [response, ...prev]);
        
        toast({
          title: 'File uploaded',
          description: `${file.name} uploaded successfully and is being processed`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to upload file',
        variant: 'destructive',
      });
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <FileUploader onFilesAdded={handleFilesAdded} />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fileList.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.filename}</TableCell>
                <TableCell>{file.type}</TableCell>
                <TableCell>{formatFileSize(file.size)}</TableCell>
                <TableCell>
                  {file.status === 'processing' ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </span>
                  ) : (
                    file.status
                  )}
                </TableCell>
                <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
