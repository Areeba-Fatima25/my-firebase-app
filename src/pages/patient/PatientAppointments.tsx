import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  Building2,
  Syringe,
  TestTube,
  Clock,
  MapPin
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PatientAppointments = () => {
  const { user, role, hospitals, isLoading } = useAuth();
  const { getPatientAppointments } = useAppointments();

  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (role !== 'patient') {
    return <Navigate to="/patient/login" replace />;
  }

  const appointments = getPatientAppointments(user?.id || '');
  const pendingAppointments = appointments.filter(a => a.status === 'Pending');
  const approvedAppointments = appointments.filter(a => a.status === 'Approved');
  const rejectedAppointments = appointments.filter(a => a.status === 'Rejected');



  const AppointmentCard = ({ appointment }: { appointment: typeof appointments[0] }) => {
    return (
      <Card className="hover-lift">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${appointment.purpose === 'Vaccination'
                ? 'bg-secondary/10'
                : 'bg-primary/10'
                }`}>
                {appointment.purpose === 'Vaccination' ? (
                  <Syringe className="h-6 w-6 text-secondary" />
                ) : (
                  <TestTube className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{appointment.purpose}</h3>
                <p className="text-sm text-muted-foreground">ID: {appointment.id}</p>
              </div>
            </div>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{appointment.hospital?.name || 'Unknown Hospital'}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{appointment.hospital?.city || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{appointment.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Booked on: {appointment.createdAt}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout
      title="My Appointments"
      subtitle="View and track all your appointments"
    >
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAppointments.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedAppointments.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No appointments found</h3>
                  <p className="text-muted-foreground">
                    You haven't booked any appointments yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No pending appointments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedAppointments.length > 0 ? (
              approvedAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No approved appointments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rejectedAppointments.length > 0 ? (
              rejectedAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No rejected appointments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PatientAppointments;
