import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";

import Index from "./pages/Index";
import NewsArticle from "./pages/NewsArticle";
import Vaccines from "./pages/Vaccines";
import News from "./pages/News";
import NotFound from "./pages/NotFound";

// Patient Pages
import PatientLogin from "./pages/patient/PatientLogin";
import PatientRegister from "./pages/patient/PatientRegister";
import PatientDashboard from "./pages/patient/PatientDashboard";
import SearchHospital from "./pages/patient/SearchHospital";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientAppointments from "./pages/patient/PatientAppointments";
import PatientReports from "./pages/patient/PatientReports";
import PatientSettings from "./pages/patient/PatientSettings";

// Hospital Pages
import HospitalLogin from "./pages/hospital/HospitalLogin";
import HospitalRegister from "./pages/hospital/HospitalRegister";
import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalAppointments from "./pages/hospital/HospitalAppointments";
import HospitalCovidTests from "./pages/hospital/HospitalCovidTests";
import HospitalVaccinations from "./pages/hospital/HospitalVaccinations";
import HospitalPatients from "./pages/hospital/HospitalPatients";

// Hospital Settings
import HospitalSettings from "./pages/hospital/HospitalSettings";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHospitals from "./pages/admin/AdminHospitals";
import AdminVaccines from "./pages/admin/AdminVaccines";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminReports from "./pages/admin/AdminReports";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNews from "./pages/admin/AdminNews";

// About Page
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppointmentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ChatbotWidget />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/vaccines" element={<Vaccines />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:articleId" element={<NewsArticle />} />

              {/* Patient Routes */}
              <Route path="/patient/login" element={<PatientLogin />} />
              <Route path="/patient/register" element={<PatientRegister />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/search-hospital" element={<SearchHospital />} />
              <Route path="/patient/book-appointment/:hospitalId" element={<BookAppointment />} />
              <Route path="/patient/appointments" element={<PatientAppointments />} />
              <Route path="/patient/reports" element={<PatientReports />} />
              <Route path="/patient/settings" element={<PatientSettings />} />

              {/* Hospital Routes */}
              <Route path="/hospital/login" element={<HospitalLogin />} />
              <Route path="/hospital/register" element={<HospitalRegister />} />
              <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
              <Route path="/hospital/appointments" element={<HospitalAppointments />} />
              <Route path="/hospital/covid-tests" element={<HospitalCovidTests />} />
              <Route path="/hospital/vaccinations" element={<HospitalVaccinations />} />
              <Route path="/hospital/patients" element={<HospitalPatients />} />
              <Route path="/hospital/settings" element={<HospitalSettings />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/hospitals" element={<AdminHospitals />} />
              <Route path="/admin/vaccines" element={<AdminVaccines />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/news" element={<AdminNews />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppointmentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
