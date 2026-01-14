import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestTube, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';

const HospitalCovidTests = () => {
  const { user, role, patients } = useAuth();
  const { covidTests } = useAppointments();

  if (role !== 'hospital') return <Navigate to="/hospital/login" replace />;

  const hospitalTests = covidTests.filter(t => t.hospitalId === user?.id);


  const positive = hospitalTests.filter(t => t.result === 'Positive').length;
  const negative = hospitalTests.filter(t => t.result === 'Negative').length;
  const pending = hospitalTests.filter(t => t.result === 'Pending').length;

  return (
    <DashboardLayout title="Covid Tests" subtitle="View all covid test records">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <TestTube className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xl font-bold">{hospitalTests.length}</p>
              <p className="text-xs text-muted-foreground">Total Tests</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-secondary" />
            <div>
              <p className="text-xl font-bold">{negative}</p>
              <p className="text-xs text-muted-foreground">Negative</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-6 w-6 text-destructive" />
            <div>
              <p className="text-xl font-bold">{positive}</p>
              <p className="text-xs text-muted-foreground">Positive</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-warning/10">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-warning" />
            <div>
              <p className="text-xl font-bold">{pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {hospitalTests.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitalTests.map(test => (
            <Card key={test.id} className="hover-lift">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TestTube className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">RT-PCR Test</p>
                      <p className="text-xs text-muted-foreground">ID: {test.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={test.result} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{test.patient?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{test.testDate}</span>
                  </div>
                  {test.remarks && (
                    <p className="p-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
                      {test.remarks}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <TestTube className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No test records yet</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default HospitalCovidTests;
