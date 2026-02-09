import { ReactNode, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Shield,
  XCircle,
  Users,
  Car,
  UserCog,
  BarChart3,
  LogOut,
  Settings,
  Clock,
  DollarSign,
  ClipboardList,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Service Requests', href: '/admin/service-requests', icon: FileText },
  { name: 'Escalations', href: '/admin/escalations', icon: AlertTriangle },
  { name: 'Disputes', href: '/admin/disputes', icon: Shield },
  { name: 'Cancellations', href: '/admin/cancellations', icon: XCircle },
  { name: 'Users & Subscriptions', href: '/admin/users', icon: Users },
  { name: 'Drivers', href: '/admin/drivers', icon: UserCog },
  { name: 'Vehicles', href: '/admin/vehicles', icon: Car },
  { name: 'Rides', href: '/admin/rides', icon: Clock },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Finances', href: '/admin/finances', icon: DollarSign },
  { name: 'Applications', href: '/admin/applications', icon: ClipboardList },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAdminAuth();
  const location = useLocation();

  // Add admin-dashboard class to body for dark theme styles
  useEffect(() => {
    document.body.classList.add('admin-dashboard');
    return () => {
      document.body.classList.remove('admin-dashboard');
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f151b] text-white overflow-hidden flex h-screen">
      {/* Sidebar - Fixed position on desktop */}
      <aside className="w-64 bg-[#111418] border-r border-[#283039] flex-col flex h-full shrink-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 pb-2 flex items-center gap-3 border-b border-[#283039]">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg h-10 w-10 shrink-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold leading-normal">LuxeRide</h1>
              <p className="text-[#9dabb9] text-xs font-normal leading-normal">Admin Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1">
            <nav className="flex flex-col gap-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5',
                        isActive ? 'text-primary' : 'text-[#9dabb9] group-hover:text-white'
                      )}
                      fill={isActive ? 'currentColor' : 'none'}
                    />
                    <p className="text-sm font-medium leading-normal">{item.name}</p>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* User section */}
          <div className="p-4 border-t border-[#283039] flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-semibold shrink-0">
                {user?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.full_name || 'Admin User'}
                </p>
                <p className="text-xs text-[#9dabb9] truncate">{user?.email || 'admin@luxeride.com'}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[#9dabb9] hover:text-white hover:bg-[#283039] transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <p className="text-sm font-medium">Sign Out</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area - flex layout */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0f151b]">
        {/* Top bar - removed, pages handle their own headers now */}
        {/* Page content - full height */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
