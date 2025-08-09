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
    MoreVertical,
    Trash2,
    Edit
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type User } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
  } from "@/components/ui/dialog"
import { EditUserForm } from './edit-user-form';

interface UsersTableProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `just now`;
}

export function UsersTable({ users, onUpdateUser, onDeleteUser }: UsersTableProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
    const [userToDelete, setUserToDelete] = React.useState<string | null>(null);

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setIsEditDialogOpen(true);
    };

    const handleFormSubmit = (updatedUser: User) => {
        onUpdateUser(updatedUser);
        setIsEditDialogOpen(false);
        setSelectedUser(null);
    }

  return (
    <>
    <div className="rounded-lg border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                        <Badge variant={user.status === 'active' ? 'secondary' : 'outline'} className="capitalize">{user.status}</Badge>
                    </TableCell>
                    <TableCell>{formatRelativeDate(user.lastLogin)}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => handleEditClick(user)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={() => setUserToDelete(user.id)}
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
    <AlertDialog open={!!userToDelete} onOpenChange={(isOpen) => !isOpen && setUserToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user account.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                if(userToDelete) {
                    onDeleteUser(userToDelete)
                }
            }} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                    Modify the user details below.
                </DialogDescription>
            </DialogHeader>
            {selectedUser && (
                <EditUserForm
                    user={selectedUser}
                    onSubmit={handleFormSubmit}
                />
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
