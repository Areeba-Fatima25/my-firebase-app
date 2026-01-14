// Demo Data for Covid Vaccination Management System

export interface Patient {
  id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  hospitalId: string;
  purpose: 'Covid Test' | 'Vaccination';
  date: string;
  time: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  patient?: Patient;
  hospital?: Hospital;
}

export interface CovidTest {
  id: string;
  appointmentId: string;
  patientId: string;
  hospitalId: string;
  result: 'Positive' | 'Negative' | 'Pending';
  testDate: string;
  remarks: string;
  file_path?: string;
  file?: File | null;
  patient?: Patient;
  hospital?: Hospital;
}

export interface Vaccination {
  id: string;
  appointmentId: string;
  patientId: string;
  hospitalId: string;
  vaccineId: string;
  doseNumber: number;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
  vaccinationDate: string;
  patient?: Patient;
  hospital?: Hospital;
}

export interface Vaccine {
  id: string;
  name: string;
  manufacturer: string;
  dosesRequired: number;
  available: boolean;
}

// Demo Patients
export const demoPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Muhammad Ali',
    email: 'ali@user.pk',
    mobile: '03001234567',
    dob: '1990-05-15',
    gender: 'Male',
    address: 'House 123, Street 5, F-10',
    city: 'Islamabad',
    createdAt: '2024-01-10'
  },
  {
    id: 'p2',
    name: 'Fatima Ahmed',
    email: 'fatima@user.pk',
    mobile: '03217654321',
    dob: '1995-08-22',
    gender: 'Female',
    address: 'Flat 402, Clifton Gardens',
    city: 'Karachi',
    createdAt: '2024-01-12'
  },
  {
    id: 'p3',
    name: 'Zain Malik',
    email: 'zain@user.pk',
    mobile: '03335555555',
    dob: '1988-03-10',
    gender: 'Male',
    address: '14-B, Gulberg III',
    city: 'Lahore',
    createdAt: '2024-01-15'
  }
];

// Demo Hospitals
export const demoHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Aga Khan University Hospital',
    email: 'akuh@hospital.pk',
    phone: '021-34861000',
    address: 'Stadium Road',
    city: 'Karachi',
    status: 'Approved',
    createdAt: '2024-01-01'
  },
  {
    id: 'h2',
    name: 'Shifa International Hospital',
    email: 'shifa@hospital.pk',
    phone: '051-8463000',
    address: 'H-8/4',
    city: 'Islamabad',
    status: 'Approved',
    createdAt: '2024-01-02'
  },
  {
    id: 'h3',
    name: 'Shaukat Khanum Memorial Hospital',
    email: 'skmch@hospital.pk',
    phone: '042-35905000',
    address: '7A Block R-3, Johar Town',
    city: 'Lahore',
    status: 'Approved',
    createdAt: '2024-01-03'
  },
  {
    id: 'h4',
    name: 'Jinnah Postgraduate Medical Centre',
    email: 'jpmc@hospital.pk',
    phone: '021-99201300',
    address: 'Rafiqui Shaheed Road',
    city: 'Karachi',
    status: 'Pending',
    createdAt: '2024-01-05'
  },
  {
    id: 'h5',
    name: 'Lady Reading Hospital',
    email: 'lrh@hospital.pk',
    phone: '091-9211430',
    address: 'Soekarno Road',
    city: 'Peshawar',
    status: 'Pending',
    createdAt: '2024-01-08'
  }
];

// Demo Appointments
export const demoAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    hospitalId: 'h1',
    purpose: 'Covid Test',
    date: '2024-02-15',
    time: '10:00',
    status: 'Approved',
    createdAt: '2024-02-10'
  },
  {
    id: 'a2',
    patientId: 'p1',
    hospitalId: 'h1',
    purpose: 'Vaccination',
    date: '2024-02-20',
    time: '11:00',
    status: 'Approved',
    createdAt: '2024-02-16'
  },
  {
    id: 'a3',
    patientId: 'p2',
    hospitalId: 'h2',
    purpose: 'Vaccination',
    date: '2024-02-18',
    time: '14:00',
    status: 'Pending',
    createdAt: '2024-02-12'
  },
  {
    id: 'a4',
    patientId: 'p3',
    hospitalId: 'h3',
    purpose: 'Covid Test',
    date: '2024-02-22',
    time: '09:00',
    status: 'Rejected',
    createdAt: '2024-02-14'
  }
];

// Demo Covid Tests
export const demoCovidTests: CovidTest[] = [
  {
    id: 'ct1',
    appointmentId: 'a1',
    patientId: 'p1',
    hospitalId: 'h1',
    result: 'Negative',
    testDate: '2024-02-15',
    remarks: 'RT-PCR test conducted. Results negative.'
  }
];

// Demo Vaccinations
export const demoVaccinations: Vaccination[] = [
  {
    id: 'v1',
    appointmentId: 'a2',
    patientId: 'p1',
    hospitalId: 'h1',
    vaccineId: 'vac1',
    doseNumber: 1,
    status: 'Completed',
    vaccinationDate: '2024-02-20'
  }
];

// Demo Vaccines
export const demoVaccines: Vaccine[] = [
  {
    id: 'vac1',
    name: 'Sinopharm',
    manufacturer: 'China National Pharmaceutical Group',
    dosesRequired: 2,
    available: true
  },
  {
    id: 'vac2',
    name: 'Pfizer-BioNTech',
    manufacturer: 'Pfizer Inc.',
    dosesRequired: 2,
    available: true
  },
  {
    id: 'vac3',
    name: 'CanSino',
    manufacturer: 'CanSino Biologics',
    dosesRequired: 1,
    available: true
  },
  {
    id: 'vac4',
    name: 'AstraZeneca',
    manufacturer: 'Oxford University',
    dosesRequired: 2,
    available: true
  }
];

// Demo Credentials
export const demoCredentials = {
  patient: { email: 'rahul@demo.com', password: 'demo123' },
  hospital: { email: 'city@hospital.com', password: 'demo123' },
  admin: { username: 'admin', password: 'admin123' }
};

// Cities for search
export const cities = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad'
];

// Stats for Dashboard
export const dashboardStats = {
  totalPatients: 15420,
  totalHospitals: 342,
  totalVaccinations: 125680,
  totalTests: 89540,
  pendingAppointments: 1250,
  approvedHospitals: 298
};
