import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Building2, User, Syringe, TestTube, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminAppointments = () => {
  const { role, hospitals, patients } = useAuth();
  const { appointments } = useAppointments();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHospital, setFilterHospital] = useState('all');

  if (role !== 'admin') return <Navigate to="/admin/login" replace />;



  const filteredAppointments = appointments.filter(a => {
    const patientName = (a.patient?.name || 'Unknown').toLowerCase();
    const hospitalName = (a.hospital?.name || 'Unknown').toLowerCase();
    const matchesSearch = patientName.includes(searchQuery.toLowerCase()) ||
      hospitalName.includes(searchQuery.toLowerCase());
    const matchesHospital = filterHospital === 'all' || a.hospitalId === filterHospital;
    return matchesSearch && matchesHospital;
  });

  const pending = filteredAppointments.filter(a => a.status === 'Pending');
  const approved = filteredAppointments.filter(a => a.status === 'Approved');
  const rejected = filteredAppointments.filter(a => a.status === 'Rejected');

  const AppointmentCard = ({ appointment }: { appointment: typeof appointments[0] }) => (
    <Card className="hover-lift">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${appointment.purpose === 'Vaccination' ? 'bg-secondary/10' : 'bg-primary/10'}`}>
              {appointment.purpose === 'Vaccination' ? (
                <Syringe className="h-5 w-5 text-secondary" />
              ) : (
                <TestTube className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium">{appointment.purpose}</p>
              <p className="text-xs text-muted-foreground">ID: {appointment.id}</p>
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{appointment.patient?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{appointment.hospital?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{appointment.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="All Appointments" subtitle="View and monitor all appointments">
      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or hospital..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterHospital} onValueChange={setFilterHospital}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Filter by Hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Hospitals</SelectItem>
                {hospitals.map(h => (
                  <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{filteredAppointments.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-warning/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{pending.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-secondary">{approved.length}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{rejected.length}</p>
            <p className="text-sm text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({filteredAppointments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAppointments.map(a => <AppointmentCard key={a.id} appointment={a} />)}
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map(a => <AppointmentCard key={a.id} appointment={a} />)}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map(a => <AppointmentCard key={a.id} appointment={a} />)}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rejected.map(a => <AppointmentCard key={a.id} appointment={a} />)}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminAppointments;
