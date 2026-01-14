import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Syringe, Calendar, User, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';

const HospitalVaccinations = () => {
  const { user, role, patients } = useAuth();
  const { vaccinations, vaccines } = useAppointments();

  if (role !== 'hospital') return <Navigate to="/hospital/login" replace />;

  const hospitalVaccinations = vaccinations.filter(v => v.hospitalId === user?.id);

  const getVaccineName = (id: string) => vaccines.find(v => String(v.id) === String(id))?.name || 'Unknown';

  const completed = hospitalVaccinations.filter(v => v.status === 'Completed').length;
  const dose1 = hospitalVaccinations.filter(v => v.doseNumber === 1).length;
  const dose2 = hospitalVaccinations.filter(v => v.doseNumber === 2).length;

  return (
    <DashboardLayout title="Vaccinations" subtitle="View all vaccination records">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Syringe className="h-6 w-6 text-secondary" />
            <div>
              <p className="text-xl font-bold">{hospitalVaccinations.length}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10">
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 className="h-6 w-6 text-secondary" />
            <div>
              <p className="text-xl font-bold">{completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="text-primary font-bold text-lg">D1</div>
            <div>
              <p className="text-xl font-bold">{dose1}</p>
              <p className="text-xs text-muted-foreground">Dose 1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-accent/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="text-accent font-bold text-lg">D2</div>
            <div>
              <p className="text-xl font-bold">{dose2}</p>
              <p className="text-xs text-muted-foreground">Dose 2</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {hospitalVaccinations.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitalVaccinations.map(vaccination => (
            <Card key={vaccination.id} className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Syringe className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">{getVaccineName(vaccination.vaccineId)}</p>
                      <p className="text-xs text-muted-foreground">Dose {vaccination.doseNumber}</p>
                    </div>
                  </div>
                  <StatusBadge status={vaccination.status} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{vaccination.patient?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{vaccination.vaccinationDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Syringe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No vaccination records yet</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default HospitalVaccinations;
