'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Users,
  Settings,
  Shield,
} from 'lucide-react';
import { UserNav } from '@/components/dashboard/user-nav';

const menuItems = [
  { href: '/admin', label: 'Users', icon: Users },
  { href: '/dashboard', label: 'File Manager', icon: Shield },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className="border-r"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader>
        <Link href="/admin" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">
                Admin Panel
            </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
