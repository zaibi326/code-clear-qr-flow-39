
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ScanActivityChart } from '@/components/dashboard/ScanActivityChart';
import { ProjectSelector } from '@/components/dashboard/ProjectSelector';
import { MultiProjectComparison } from '@/components/dashboard/MultiProjectComparison';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset>
            <DashboardTopbar />
            <main className="flex-1 p-6 space-y-6">
              <QRTypeSelector />
              
              <ProjectSelector />
              <DashboardStats />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <ScanActivityChart />
                </div>
                <div className="space-y-6">
                  <MultiProjectComparison />
                  <NotificationCenter />
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
