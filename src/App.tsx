import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CoupleProvider, useCoupleContext } from "./contexts/CoupleContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CoupleHome from "./pages/CoupleHome";
import InsecurityVault from "./pages/InsecurityVault";
import Diary from "./pages/Diary";
import Games from "./pages/Games";
import Memories from "./pages/Memories";
import Activities from "./pages/Activities";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Navigation } from "./components/Navigation";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useCoupleContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const AppRoutes = () => {
  const { isAuthenticated, couple } = useCoupleContext();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
            <Route path="/couple-home" element={<ProtectedRoute><CoupleHome /></ProtectedRoute>} />
            <Route path="/insecurity-vault" element={<ProtectedRoute><InsecurityVault /></ProtectedRoute>} />
      <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
      <Route path="/memories" element={<ProtectedRoute><Memories /></ProtectedRoute>} />
      <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CoupleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-sunset">
            <Navigation />
            <AppRoutes />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </CoupleProvider>
  </QueryClientProvider>
);

export default App;
