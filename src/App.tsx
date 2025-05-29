
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseAuthProvider } from "@/components/auth/SupabaseAuthProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import QuickGenerate from "./pages/QuickGenerate";
import CampaignCreator from "./pages/CampaignCreator";
import Analytics from "./pages/Analytics";
import TemplateManager from "./pages/TemplateManager";
import DataManager from "./pages/DataManager";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Testing from "./pages/Testing";
import Monitoring from "./pages/Monitoring";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import BulkDataSelector from "./pages/BulkDataSelector";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/quick-generate" element={
              <ProtectedRoute>
                <QuickGenerate />
              </ProtectedRoute>
            } />
            <Route path="/campaigns" element={
              <ProtectedRoute>
                <CampaignCreator />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/templates" element={
              <ProtectedRoute>
                <TemplateManager />
              </ProtectedRoute>
            } />
            <Route path="/data-manager" element={
              <ProtectedRoute>
                <DataManager />
              </ProtectedRoute>
            } />
            <Route path="/bulk-data-selector" element={
              <ProtectedRoute>
                <BulkDataSelector />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            } />
            <Route path="/testing" element={
              <ProtectedRoute>
                <Testing />
              </ProtectedRoute>
            } />
            <Route path="/monitoring" element={
              <ProtectedRoute>
                <Monitoring />
              </ProtectedRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseAuthProvider>
  </QueryClientProvider>
);

export default App;
