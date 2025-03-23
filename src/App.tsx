
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import ContractPage from "./pages/ContractPage";
import ContractsPage from "./pages/ContractsPage";
import ContractViewPage from "./pages/ContractViewPage";
import TrackingPage from "./pages/TrackingPage";
import LoginPage from "./pages/LoginPage";
import UserManagementPage from "./pages/UserManagementPage";
import InstallationGuidePage from "./pages/InstallationGuidePage";
import VehicleChecklistPage from "./pages/VehicleChecklistPage";
import VehicleChecklistsPage from "./pages/VehicleChecklistsPage";
import UserProfilePage from "./pages/UserProfilePage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/acesso-negado" element={<AccessDeniedPage />} />
            
            {/* Rotas protegidas para todos os usuários autenticados */}
            <Route 
              path="/contracts" 
              element={
                <ProtectedRoute>
                  <ContractsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contracts/:contractId" 
              element={
                <ProtectedRoute>
                  <ContractViewPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contracts/:contractId/checklist" 
              element={
                <ProtectedRoute>
                  <VehicleChecklistPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checklists" 
              element={
                <ProtectedRoute>
                  <VehicleChecklistsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tracking" 
              element={
                <ProtectedRoute>
                  <TrackingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas protegidas apenas para administradores */}
            <Route 
              path="/new-contract" 
              element={
                <ProtectedRoute requireAdmin>
                  <ContractPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requireAdmin>
                  <UserManagementPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/installation" 
              element={
                <ProtectedRoute requireAdmin>
                  <InstallationGuidePage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
