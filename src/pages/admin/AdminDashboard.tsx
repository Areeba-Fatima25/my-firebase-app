import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Calendar, Syringe, TestTube, CheckCircle, Clock, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/stat-card';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { dashboardStats } from '@/lib/demoData';

const AdminDashboard = () => {
  const { role, patients, hospitals, isLoading } = useAuth();
  const { appointments, covidTests, vaccinations } = useAppointments();

  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (role !== 'admin') return <Navigate to="/admin/login" replace />;

  const pendingHospitals = hospitals.filter(h => h.status === 'Pending').length;
  const approvedHospitals = hospitals.filter(h => h.status === 'Approved').length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="System overview and management">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Patients" value={patients.length} icon={Users} variant="primary" trend={{ value: 12, isPositive: true }} />
        <StatCard title="Total Hospitals" value={hospitals.length} icon={Building2} variant="secondary" />
        <StatCard title="Vaccinations" value={vaccinations.length} icon={Syringe} variant="accent" />
        <StatCard title="Covid Tests" value={covidTests.length} icon={TestTube} variant="default" />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-warning/10"><Clock className="h-6 w-6 text-warning" /></div>
              <div><h3 className="text-2xl font-bold">{pendingHospitals}</h3><p className="text-muted-foreground">Pending Hospitals</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-secondary/10"><CheckCircle className="h-6 w-6 text-secondary" /></div>
              <div><h3 className="text-2xl font-bold">{approvedHospitals}</h3><p className="text-muted-foreground">Approved Hospitals</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-primary/10"><Calendar className="h-6 w-6 text-primary" /></div>
              <div><h3 className="text-2xl font-bold">{pendingAppointments}</h3><p className="text-muted-foreground">Pending Appointments</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.slice(-5).reverse().map((a) => (
              <div key={a.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${a.status === 'Approved' ? 'bg-secondary/10' : a.status === 'Rejected' ? 'bg-destructive/10' : 'bg-warning/10'}`}>
                    {a.status === 'Approved' ? <CheckCircle className="h-4 w-4 text-secondary" /> : a.status === 'Rejected' ? <XCircle className="h-4 w-4 text-destructive" /> : <Clock className="h-4 w-4 text-warning" />}
                  </div>
                  <div><p className="font-medium">{a.purpose}</p><p className="text-sm text-muted-foreground">{a.date} at {a.time}</p></div>
                </div>
                <span className={`text-sm font-medium ${a.status === 'Approved' ? 'text-secondary' : a.status === 'Rejected' ? 'text-destructive' : 'text-warning'}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminDashboard;
