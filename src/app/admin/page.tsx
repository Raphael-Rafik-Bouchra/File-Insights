'use client';

import * as React from 'react';
import { UsersTable } from '@/components/admin/users-table';
import { type User } from '@/types';

const mockUsers: User[] = [
    { id: 'usr_1', name: 'John Doe', email: 'john.doe@example.com', role: 'user', status: 'active', lastLogin: new Date('2023-10-26T10:00:00Z') },
    { id: 'usr_2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'user', status: 'active', lastLogin: new Date('2023-10-25T14:30:00Z') },
    { id: 'usr_3', name: 'Admin User', email: 'admin@admin.com', role: 'admin', status: 'active', lastLogin: new Date() },
    { id: 'usr_4', name: 'Inactive User', email: 'inactive@example.com', role: 'user', status: 'inactive', lastLogin: new Date('2023-01-15T09:00:00Z') },
    { id: 'usr_5', name: 'Bob Johnson', email: 'bob.j@somecorp.com', role: 'user', status: 'active', lastLogin: new Date('2023-10-27T11:00:00Z') },
];


export default function AdminPage() {
    const [users, setUsers] = React.useState<User[]>(mockUsers);

    const handleUpdateUser = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    }

    const handleDeleteUser = (userId: string) => {
        setUsers(users.filter(u => u.id !== userId));
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">User Management</h1>
        <p className="text-muted-foreground">
          Manage users and their permissions.
        </p>
      </div>
      <UsersTable 
        users={users}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
