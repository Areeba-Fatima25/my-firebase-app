import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Users, Syringe, TestTube, Clock, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/stat-card';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';

const HospitalDashboard = () => {
  const { user, role, isLoading } = useAuth();
  const { getHospitalAppointments, covidTests, vaccinations } = useAppointments();

  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (role !== 'hospital') return <Navigate to="/hospital/login" replace />;

  const appointments = getHospitalAppointments(user?.id || '');
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const approved = appointments.filter(a => a.status === 'Approved').length;
  const hospitalTests = covidTests.filter(t => t.hospitalId === user?.id).length;
  const hospitalVaccinations = vaccinations.filter(v => v.hospitalId === user?.id).length;

  return (
    <DashboardLayout title={`Welcome, ${user?.name}!`} subtitle="Manage your hospital appointments and services">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Appointments" value={appointments.length} icon={Calendar} variant="primary" />
        <StatCard title="Pending Approval" value={pending} icon={Clock} variant="default" />
        <StatCard title="Covid Tests Done" value={hospitalTests} icon={TestTube} variant="accent" />
        <StatCard title="Vaccinations Done" value={hospitalVaccinations} icon={Syringe} variant="secondary" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-xl bg-warning/10"><Clock className="h-6 w-6 text-warning" /></div>
              <div><h3 className="font-semibold text-xl">{pending}</h3><p className="text-muted-foreground">Pending Appointments</p></div>
            </div>
            <p className="text-sm text-muted-foreground">Appointments waiting for your approval</p>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-xl bg-secondary/10"><CheckCircle className="h-6 w-6 text-secondary" /></div>
              <div><h3 className="font-semibold text-xl">{approved}</h3><p className="text-muted-foreground">Approved Appointments</p></div>
            </div>
            <p className="text-sm text-muted-foreground">Ready for patient visits</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HospitalDashboard;
