import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { demoPatients, demoHospitals, demoCredentials, Patient, Hospital } from '@/lib/demoData';
import api from '@/lib/axios';

type UserRole = 'patient' | 'hospital' | 'admin' | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginPatient: (email: string, password: string) => Promise<boolean>;
  loginHospital: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginAdmin: (username: string, password: string) => Promise<boolean>;
  registerPatient: (patient: Omit<Patient, 'id' | 'createdAt'> & { password?: string; password_confirmation?: string }) => Promise<boolean>;
  registerHospital: (hospital: Omit<Hospital, 'id' | 'createdAt' | 'status'> & { password?: string; password_confirmation?: string }) => Promise<boolean>;
  logout: () => void;
  patients: Patient[];
  hospitals: Hospital[];
  updateHospitalStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  deletePatient: (id: string) => Promise<void>;
  deleteHospital: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : demoPatients;
  });
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const stored = localStorage.getItem('hospitals');
    return stored ? JSON.parse(stored) : demoHospitals;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch data for admin
  useEffect(() => {
    const fetchData = async () => {
      if (user?.role === 'admin') {
        try {
          const [patientsRes, hospitalsRes] = await Promise.all([
            api.get('/patients'),
            api.get('/hospitals')
          ]);

          if (patientsRes.data.success) {
            setPatients(patientsRes.data.data);
          }

          if (hospitalsRes.data.success) {
            setHospitals(hospitalsRes.data.data);
          }
        } catch (error) {
          console.error('Failed to fetch admin data', error);
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  // Replaced local storage with API calls
  const loginPatient = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/patient/login', { email, password });
      if (response.data.success) {
        const authUser = {
          id: response.data.data.user.id.toString(),
          name: response.data.data.user.name,
          email: response.data.data.user.email,
          role: 'patient' as UserRole
        };
        setUser(authUser);
        localStorage.setItem('authUser', JSON.stringify(authUser));
        localStorage.setItem('token', response.data.data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  };

  const loginHospital = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/auth/hospital/login', { email, password });
      if (response.data.success) {
        const authUser = {
          id: response.data.data.user.id.toString(),
          name: response.data.data.user.name,
          email: response.data.data.user.email,
          role: 'hospital' as UserRole
        };
        setUser(authUser);
        localStorage.setItem('authUser', JSON.stringify(authUser));
        localStorage.setItem('token', response.data.data.token);
        return { success: true, message: 'Login successful' };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const loginAdmin = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/admin/login', { username, password });
      if (response.data.success) {
        const authUser = {
          id: response.data.data.user.id.toString(),
          name: response.data.data.user.username,
          email: response.data.data.user.email,
          role: 'admin' as UserRole
        };
        setUser(authUser);
        localStorage.setItem('authUser', JSON.stringify(authUser));
        localStorage.setItem('token', response.data.data.token);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const registerPatient = async (patientData: Omit<Patient, 'id' | 'createdAt'> & { password?: string; password_confirmation?: string }): Promise<boolean> => {
    try {
      const response = await api.post('/auth/patient/register', patientData);
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  const registerHospital = async (hospitalData: Omit<Hospital, 'id' | 'createdAt' | 'status'> & { password?: string; password_confirmation?: string }): Promise<boolean> => {
    try {
      const response = await api.post('/auth/hospital/register', hospitalData);
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  const updateHospitalStatus = async (id: string, status: 'Approved' | 'Rejected') => {
    try {
      await api.put(`/hospitals/${id}/status`, { status });
      // Optimistically update list
      setHospitals(prev => prev.map(h => h.id === id ? { ...h, status } : h));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const deletePatient = async (id: string) => {
    try {
      await api.delete(`/patients/${id}`);
      setPatients(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete patient', error);
    }
  };

  const deleteHospital = async (id: string) => {
    try {
      await api.delete(`/hospitals/${id}`);
      setHospitals(prev => prev.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete hospital', error);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore logout errors
    } finally {
      setUser(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || null,
      isAuthenticated: !!user,
      isLoading,
      loginPatient,
      loginHospital,
      loginAdmin,
      registerPatient,
      registerHospital,
      logout,
      patients,
      hospitals,
      updateHospitalStatus,
      deletePatient,
      deleteHospital
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
