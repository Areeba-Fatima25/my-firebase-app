import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Search, User, Building2, Calendar, Mail, Phone, MapPin, Shield, Ban, Eye, X } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminUsers = () => {
  const { role, patients, hospitals, deletePatient, deleteHospital } = useAuth();
  const { appointments, vaccinations, covidTests } = useAppointments();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDialog, setViewDialog] = useState<{
    open: boolean;
    type: 'patient' | 'hospital' | null;
    data: any;
  }>({
    open: false,
    type: null,
    data: null
  });

  if (role !== 'admin') return <Navigate to="/admin/login" replace />;

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPatientStats = (patientId: string) => {
    const patientAppointments = appointments.filter(a => a.patientId === patientId);
    const patientVaccinations = vaccinations.filter(v => v.patientId === patientId);
    const patientTests = covidTests.filter(t => t.patientId === patientId);
    return {
      appointments: patientAppointments.length,
      vaccinations: patientVaccinations.length,
      tests: patientTests.length
    };
  };

  const getHospitalStats = (hospitalId: string) => {
    const hospitalAppointments = appointments.filter(a => a.hospitalId === hospitalId);
    const hospitalVaccinations = vaccinations.filter(v => v.hospitalId === hospitalId);
    const hospitalTests = covidTests.filter(t => t.hospitalId === hospitalId);
    return {
      appointments: hospitalAppointments.length,
      vaccinations: hospitalVaccinations.length,
      tests: hospitalTests.length
    };
  };

  return (
    <DashboardLayout title="User Management" subtitle="Manage patients and hospital accounts">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-primary/10">
          <CardContent className="p-4 flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{patients.length}</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10">
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">{hospitals.length}</p>
              <p className="text-sm text-muted-foreground">Total Hospitals</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="patients" className="space-y-6">
        <TabsList>
          <TabsTrigger value="patients">
            <User className="h-4 w-4 mr-2" />
            Patients ({filteredPatients.length})
          </TabsTrigger>
          <TabsTrigger value="hospitals">
            <Building2 className="h-4 w-4 mr-2" />
            Hospitals ({filteredHospitals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map(patient => (
              <Card key={patient.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <Badge variant="outline" className="text-xs">
                          <User className="h-3 w-3 mr-1" />
                          Patient
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{patient.mobile}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{patient.city}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setViewDialog({ open: true, type: 'patient', data: patient })}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this patient?')) {
                          deletePatient(patient.id);
                        }
                      }}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hospitals">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHospitals.map(hospital => (
              <Card key={hospital.id} className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">{hospital.name}</p>
                        <Badge
                          variant={hospital.status === 'Approved' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {hospital.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{hospital.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{hospital.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{hospital.city}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setViewDialog({ open: true, type: 'hospital', data: hospital })}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this hospital?')) {
                          deleteHospital(hospital.id);
                        }
                      }}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ ...viewDialog, open })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewDialog.type === 'patient' ? (
                <><User className="h-5 w-5 text-primary" /> Patient Details</>
              ) : (
                <><Building2 className="h-5 w-5 text-secondary" /> Hospital Details</>
              )}
            </DialogTitle>
            <DialogDescription>
              Complete information and statistics
            </DialogDescription>
          </DialogHeader>

          {viewDialog.type === 'patient' && viewDialog.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-2xl">
                    {viewDialog.data.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{viewDialog.data.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewDialog.data.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewDialog.data.mobile}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{viewDialog.data.city}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{viewDialog.data.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium text-xs">{viewDialog.data.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(() => {
                  const stats = getPatientStats(viewDialog.data.id);
                  return (
                    <>
                      <div className="text-center p-3 bg-primary/10 rounded-xl">
                        <p className="text-xl font-bold text-primary">{stats.appointments}</p>
                        <p className="text-xs text-muted-foreground">Appointments</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/10 rounded-xl">
                        <p className="text-xl font-bold text-secondary">{stats.vaccinations}</p>
                        <p className="text-xs text-muted-foreground">Vaccinations</p>
                      </div>
                      <div className="text-center p-3 bg-accent/10 rounded-xl">
                        <p className="text-xl font-bold text-accent">{stats.tests}</p>
                        <p className="text-xs text-muted-foreground">Covid Tests</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {viewDialog.type === 'hospital' && viewDialog.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{viewDialog.data.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewDialog.data.email}</p>
                  <Badge variant={viewDialog.data.status === 'Approved' ? 'default' : 'secondary'}>
                    {viewDialog.data.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{viewDialog.data.phone}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{viewDialog.data.city}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{viewDialog.data.address}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{viewDialog.data.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Registration No</p>
                  <p className="font-medium">{viewDialog.data.regNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {(() => {
                  const stats = getHospitalStats(viewDialog.data.id);
                  return (
                    <>
                      <div className="text-center p-3 bg-primary/10 rounded-xl">
                        <p className="text-xl font-bold text-primary">{stats.appointments}</p>
                        <p className="text-xs text-muted-foreground">Appointments</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/10 rounded-xl">
                        <p className="text-xl font-bold text-secondary">{stats.vaccinations}</p>
                        <p className="text-xs text-muted-foreground">Vaccinations</p>
                      </div>
                      <div className="text-center p-3 bg-accent/10 rounded-xl">
                        <p className="text-xl font-bold text-accent">{stats.tests}</p>
                        <p className="text-xs text-muted-foreground">Covid Tests</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminUsers;

