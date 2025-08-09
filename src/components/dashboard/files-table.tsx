'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  CheckCircle2,
  File as FileIcon,
  Loader2,
  MoreVertical,
  RefreshCcw,
  Trash2,
  Eye,
  Copy,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type FileItem } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog"
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilesTableProps {
  files: FileItem[];
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusIcons: Record<FileItem['status'], React.ReactNode> = {
  pending: <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
  uploading: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
  processing: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
  summarizing: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
  complete: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  error: <AlertCircle className="h-4 w-4 text-destructive" />,
};

const statusText: Record<FileItem['status'], string> = {
    pending: 'Pending',
    uploading: 'Uploading...',
    processing: 'Processing...',
    summarizing: 'Summarizing...',
    complete: 'Complete',
    error: 'Error',
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function FilesTable({ files, onRetry, onDelete }: FilesTableProps) {
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortOption, setSortOption] = React.useState('uploadDate-desc');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const filteredAndSortedFiles = React.useMemo(() => {
    let filtered = files;

    if (searchTerm) {
        filtered = filtered.filter(item => item.file.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (statusFilter !== 'all') {
        filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    const [key, order] = sortOption.split('-');

    return [...filtered].sort((a, b) => {
        let valA, valB;
        switch(key) {
            case 'name':
                valA = a.file.name;
                valB = b.file.name;
                break;
            case 'size':
                valA = a.file.size;
                valB = b.file.size;
                break;
            case 'uploadDate':
                valA = a.uploadDate?.getTime() || 0;
                valB = b.uploadDate?.getTime() || 0;
                break;
            default:
                return 0;
        }

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });

  }, [files, searchTerm, sortOption, statusFilter]);

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <FileIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No files uploaded</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload some files to get started.
        </p>
      </div>
    );
  }
  
  const handleCopySummary = () => {
    if (selectedFile?.summary) {
        navigator.clipboard.writeText(selectedFile.summary);
        toast({ title: "Copied to clipboard!" });
    }
  }

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search files..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="uploading">Uploading</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="summarizing">Summarizing</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="uploadDate-desc">Newest First</SelectItem>
                        <SelectItem value="uploadDate-asc">Oldest First</SelectItem>
                        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                        <SelectItem value="size-asc">Size (Smallest)</SelectItem>
                        <SelectItem value="size-desc">Size (Largest)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div className="rounded-lg border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {filteredAndSortedFiles.map((item) => (
                <TableRow key={item.id}>
                <TableCell className="font-medium">{item.file.name}</TableCell>
                <TableCell>{formatBytes(item.file.size)}</TableCell>
                <TableCell>{item.uploadDate?.toLocaleDateString()}</TableCell>
                <TableCell>
                    <Badge variant={item.status === 'error' ? 'destructive' : 'secondary'} className="capitalize">
                        {statusIcons[item.status]}
                        <span className="ml-2">{statusText[item.status]}</span>
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {item.status === 'complete' && (
                            <DropdownMenuItem onSelect={() => setSelectedFile(item)}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>View Summary</span>
                            </DropdownMenuItem>
                        )}
                        {item.status === 'error' && (
                        <DropdownMenuItem onSelect={() => onRetry(item.id)}>
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            <span>Retry</span>
                        </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => handleDownloadFile(item.file)}>
                            <FileIcon className="mr-2 h-4 w-4" />
                            <span>Download</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        className="text-destructive"
                        onSelect={() => onDelete(item.id)}
                        >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </div>
    </div>
    <Dialog open={!!selectedFile} onOpenChange={(isOpen) => !isOpen && setSelectedFile(null)}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Summary for {selectedFile?.file.name}</DialogTitle>
            <DialogDescription>
              AI-generated summary of the file content.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] pr-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedFile?.summary}
            </p>
          </ScrollArea>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSelectedFile(null)}>Close</Button>
            <Button onClick={handleCopySummary}><Copy className="mr-2 h-4 w-4"/> Copy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
