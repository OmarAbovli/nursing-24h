
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import Terms from "./pages/Terms";
import NotFoundPage from "./pages/NotFoundPage";

// Patient Pages
import AuthForm from "./components/AuthForm";
import PatientDashboard from "./pages/patient/PatientDashboard";
import ServiceRequestForm from "./pages/patient/ServiceRequestForm";
import TrackRequest from "./pages/patient/TrackRequest";
import OnlineSupport from "./pages/patient/OnlineSupport";
import CompleteProfile from "./pages/patient/CompleteProfile";
import Profile from "./pages/patient/Profile";

// Nurse Pages
import NurseRegisterInfo from "./pages/nurse/NurseRegisterInfo";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import ServiceSummary from "./pages/nurse/ServiceSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home and shared routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Patient Routes */}
          <Route path="/patient/login" element={<AuthForm type="login" userType="patient" />} />
          <Route path="/patient/register" element={<AuthForm type="register" userType="patient" />} />
          <Route path="/patient/complete-profile" element={<CompleteProfile />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/request-service" element={<ServiceRequestForm />} />
          <Route path="/patient/track-request" element={<TrackRequest />} />
          <Route path="/patient/online-support" element={<OnlineSupport />} />
          <Route path="/patient/profile" element={<Profile />} />

          {/* Nurse Routes */}
          <Route path="/nurse/login" element={<AuthForm type="login" userType="nurse" />} />
          <Route path="/nurse/register" element={<AuthForm type="register" userType="nurse" />} />
          <Route path="/nurse/register-info" element={<NurseRegisterInfo />} />
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          <Route path="/nurse/service-summary" element={<ServiceSummary />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
