
import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ScanActivityChart } from '@/components/dashboard/ScanActivityChart';
import { ProjectSelector } from '@/components/dashboard/ProjectSelector';
import { MultiProjectComparison } from '@/components/dashboard/MultiProjectComparison';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';
import { AdvancedQRGenerator } from '@/components/qr/AdvancedQRGenerator';
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
              
              {/* QR Code Generator Section */}
              <div className="bg-white rounded-lg border p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Your QR Code</h2>
                  <p className="text-gray-600">Configure and preview your QR code before downloading</p>
                </div>
                <AdvancedQRGenerator />
              </div>
              
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
