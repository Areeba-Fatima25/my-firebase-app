import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  demoAppointments,
  demoCovidTests,
  demoVaccinations,
  demoVaccines,
  Appointment,
  CovidTest,
  Vaccination,
  Vaccine
} from '@/lib/demoData';
import api from '@/lib/axios';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  published: boolean;
  created_at?: string;
  date?: string; // For frontend display, mapped from created_at
}

interface AppointmentContextType {
  appointments: Appointment[];
  covidTests: CovidTest[];
  vaccinations: Vaccination[];
  vaccines: Vaccine[];
  news: NewsArticle[];
  createAppointment: (data: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: 'Approved' | 'Rejected') => Promise<void>;
  addCovidTest: (data: Omit<CovidTest, 'id'>) => Promise<void>;
  addVaccination: (data: Omit<Vaccination, 'id'>) => Promise<void>;
  addVaccine: (data: Omit<Vaccine, 'id'>) => Promise<void>;
  updateVaccine: (id: string, data: Partial<Vaccine>) => Promise<void>;
  deleteVaccine: (id: string) => Promise<void>;
  updateVaccineAvailability: (id: string, available: boolean) => Promise<void>;
  addNews: (data: Omit<NewsArticle, 'id' | 'created_at'>) => Promise<void>;
  updateNews: (id: string, data: Partial<NewsArticle>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  refreshNews: () => Promise<void>;
  getPatientAppointments: (patientId: string) => Appointment[];
  getHospitalAppointments: (hospitalId: string) => Appointment[];
  getPatientCovidTests: (patientId: string) => CovidTest[];
  getPatientVaccinations: (patientId: string) => Vaccination[];
  getHospitalVaccinations: (hospitalId: string) => Vaccination[];
  newsLoading: boolean;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [covidTests, setCovidTests] = useState<CovidTest[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  // Fetch public data (Vaccines and News)
  const fetchPublicData = async () => {
    try {
      const [vaccineRes, newsRes] = await Promise.all([
        api.get('/vaccines'),
        api.get('/news/published') // Use public endpoint for news
      ]);

      if (vaccineRes.data.success) {
        const mappedVaccines = vaccineRes.data.data.map((v: any) => ({
          ...v,
          dosesRequired: v.doses_required ?? v.dosesRequired
        }));
        setVaccines(mappedVaccines);
      }

      if (newsRes.data.success) {
        // Map created_at to date for frontend compatibility
        const mappedNews = newsRes.data.data.map((n: any) => ({
          ...n,
          id: String(n.id),
          date: n.created_at || n.date
        }));
        setNews(mappedNews);
      }
    } catch (error) {
      console.error('Failed to fetch public data', error);
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch protected data (Appointments, etc.)
  const fetchProtectedData = async () => {
    try {
      const [apptRes, testRes, vaxRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/covid-tests'),
        api.get('/vaccinations')
      ]);

      if (apptRes.data.success) {
        const mappedAppointments = apptRes.data.data.map((appt: any) => ({
          ...appt,
          patientId: String(appt.patient_id),
          hospitalId: String(appt.hospital_id),
          createdAt: appt.created_at,
          patient: appt.patient,
          hospital: appt.hospital
        }));
        setAppointments(mappedAppointments);
      }
      if (testRes.data.success) {
        const mappedTests = testRes.data.data.map((t: any) => ({
          ...t,
          patientId: String(t.patient_id),
          hospitalId: String(t.hospital_id),
          patient: t.patient,
          hospital: t.hospital
        }));
        setCovidTests(mappedTests);
      }
      if (vaxRes.data.success) {
        const mappedVax = vaxRes.data.data.map((v: any) => ({
          ...v,
          patientId: String(v.patient_id),
          hospitalId: String(v.hospital_id),
          vaccineId: String(v.vaccine_id),
          appointmentId: String(v.appointment_id),
          doseNumber: v.dose_number,
          vaccinationDate: v.vaccination_date,
          patient: v.patient,
          hospital: v.hospital
        }));
        setVaccinations(mappedVax);
      }
    } catch (error) {
      console.error('Failed to fetch protected data', error);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProtectedData();
    } else {
      // Clear sensitive data on logout
      setAppointments([]);
      setCovidTests([]);
      setVaccinations([]);
    }
  }, [isAuthenticated]);

  const createAppointment = async (data: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    try {
      const payload = {
        ...data,
        patient_id: data.patientId,
        hospital_id: data.hospitalId
      };
      const response = await api.post('/appointments', payload);
      if (response.data.success) {
        const newAppointment = {
          ...response.data.data,
          patientId: String(response.data.data.patient_id),
          hospitalId: String(response.data.data.hospital_id),
          createdAt: response.data.data.created_at,
          patient: response.data.data.patient,
          hospital: response.data.data.hospital
        };
        setAppointments(prev => [...prev, newAppointment]);
        return newAppointment;
      }
    } catch (error) {
      console.error('Failed to create appointment', error);
      throw error;
    }
  };

  const updateAppointmentStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      const response = await api.put(`/appointments/${id}/status`, { status });
      if (response.data.success) {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      }
    } catch (error) {
      console.error('Failed to update appointment status', error);
    }
  };

  const addCovidTest = async (data: Omit<CovidTest, 'id'>) => {
    try {
      const formData = new FormData();
      formData.append('appointment_id', data.appointmentId);
      formData.append('patient_id', data.patientId);
      formData.append('hospital_id', data.hospitalId);
      formData.append('result', data.result);
      formData.append('test_date', data.testDate);
      if (data.remarks) formData.append('remarks', data.remarks);
      if (data.file) formData.append('file', data.file);

      const response = await api.post('/covid-tests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        const newTest = {
          ...response.data.data,
          patientId: String(response.data.data.patient_id),
          hospitalId: String(response.data.data.hospital_id),
          appointmentId: String(response.data.data.appointment_id),
          patient: response.data.data.patient,
          hospital: response.data.data.hospital
        };
        setCovidTests(prev => [...prev, newTest]);
      }
    } catch (error) {
      console.error('Failed to add covid test', error);
    }
  };

  const addVaccination = async (data: Omit<Vaccination, 'id'>) => {
    try {
      const payload = {
        appointment_id: data.appointmentId,
        patient_id: data.patientId,
        hospital_id: data.hospitalId,
        vaccine_id: data.vaccineId,
        dose_number: data.doseNumber,
        status: data.status,
        vaccination_date: data.vaccinationDate
      };
      const response = await api.post('/vaccinations', payload);
      if (response.data.success) {
        const newVaccination = {
          ...response.data.data,
          patientId: String(response.data.data.patient_id),
          hospitalId: String(response.data.data.hospital_id),
          vaccineId: String(response.data.data.vaccine_id),
          appointmentId: String(response.data.data.appointment_id),
          doseNumber: response.data.data.dose_number,
          vaccinationDate: response.data.data.vaccination_date,
          patient: response.data.data.patient,
          hospital: response.data.data.hospital
        };
        setVaccinations(prev => [...prev, newVaccination]);
      }
    } catch (error) {
      console.error('Failed to add vaccination', error);
    }
  };

  const addVaccine = async (data: Omit<Vaccine, 'id'>) => {
    try {
      const payload = {
        ...data,
        doses_required: data.dosesRequired
      };
      const response = await api.post('/vaccines', payload);
      if (response.data.success) {
        const newVaccine = {
          ...response.data.data,
          dosesRequired: response.data.data.doses_required
        };
        setVaccines(prev => [...prev, newVaccine]);
      }
    } catch (error) {
      console.error('Failed to add vaccine', error);
    }
  };

  const updateVaccine = async (id: string, data: Partial<Vaccine>) => {
    try {
      const payload: any = { ...data };
      if (data.dosesRequired !== undefined) {
        payload.doses_required = data.dosesRequired;
      }
      const response = await api.put(`/vaccines/${id}`, payload);
      if (response.data.success) {
        setVaccines(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
      }
    } catch (error) {
      console.error('Failed to update vaccine', error);
    }
  };

  const deleteVaccine = async (id: string) => {
    try {
      await api.delete(`/vaccines/${id}`);
      setVaccines(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Failed to delete vaccine', error);
    }
  };

  const updateVaccineAvailability = async (id: string, available: boolean) => {
    try {
      const response = await api.put(`/vaccines/${id}/availability`, { available });
      if (response.data.success) {
        setVaccines(prev => prev.map(v => v.id === id ? { ...v, available } : v));
      }
    } catch (error) {
      console.error('Failed to update vaccine availability', error);
    }
  };

  // News CRUD operations
  const addNews = async (data: Omit<NewsArticle, 'id' | 'created_at'>) => {
    try {
      const response = await api.post('/news', data);
      if (response.data.success) {
        setNews(prev => [response.data.data, ...prev]);
      }
    } catch (error) {
      console.error('Failed to add news', error);
      throw error;
    }
  };

  const updateNews = async (id: string, data: Partial<NewsArticle>) => {
    try {
      const response = await api.put(`/news/${id}`, data);
      if (response.data.success) {
        setNews(prev => prev.map(n => n.id === id ? { ...n, ...response.data.data } : n));
      }
    } catch (error) {
      console.error('Failed to update news', error);
      throw error;
    }
  };

  const deleteNews = async (id: string) => {
    try {
      await api.delete(`/news/${id}`);
      setNews(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete news', error);
      throw error;
    }
  };

  const refreshNews = async () => {
    try {
      const response = await api.get('/news');
      if (response.data.success) {
        setNews(response.data.data);
      }
    } catch (error) {
      console.error('Failed to refresh news', error);
    }
  };

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(a => a.patientId === patientId);
  };

  const getHospitalAppointments = (hospitalId: string) => {
    return appointments.filter(a => a.hospitalId === hospitalId);
  };

  const getPatientCovidTests = (patientId: string) => {
    return covidTests.filter(t => t.patientId === patientId);
  };

  const getPatientVaccinations = (patientId: string) => {
    return vaccinations.filter(v => v.patientId === patientId);
  };

  const getHospitalVaccinations = (hospitalId: string) => {
    return vaccinations.filter(v => v.hospitalId === hospitalId);
  };

  return (
    <AppointmentContext.Provider value={{
      appointments,
      covidTests,
      vaccinations,
      vaccines,
      news,
      createAppointment,
      updateAppointmentStatus,
      addCovidTest,
      addVaccination,
      addVaccine,
      updateVaccine,
      deleteVaccine,
      updateVaccineAvailability,
      addNews,
      updateNews,
      deleteNews,
      refreshNews,
      getPatientAppointments,
      getHospitalAppointments,
      getPatientCovidTests,
      getPatientVaccinations,
      getHospitalVaccinations,
      newsLoading
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
