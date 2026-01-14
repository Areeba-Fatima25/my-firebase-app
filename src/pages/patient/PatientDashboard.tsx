import { Link, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Building2,
  FileText,
  Syringe,
  TestTube,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Download,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/stat-card';
import StatusBadge from '@/components/ui/status-badge';
import VaccinationCertificate from '@/components/certificate/VaccinationCertificate';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';

const PatientDashboard = () => {
  const { user, role, isLoading } = useAuth();
  const { getPatientAppointments, getPatientVaccinations, getPatientCovidTests, vaccines } = useAppointments();
  const { hospitals } = useAuth();
  const [showCertificate, setShowCertificate] = useState(false);

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
  const vaccinations = getPatientVaccinations(user?.id || '');
  const covidTests = getPatientCovidTests(user?.id || '');

  const pendingAppointments = appointments.filter(a => a.status === 'Pending');
  const approvedAppointments = appointments.filter(a => a.status === 'Approved');
  const recentAppointments = appointments.slice(-3).reverse();

  // Calculate vaccination status
  const completedVaccinations = vaccinations.filter(v => v.status === 'Completed');
  const scheduledVaccinations = vaccinations.filter(v => v.status === 'Scheduled');

  // Get vaccine info for certificate
  const getVaccineInfo = () => {
    if (completedVaccinations.length === 0) return null;
    const vaccineId = completedVaccinations[0].vaccineId;
    const vaccine = vaccines.find(v => v.id === vaccineId);
    return vaccine;
  };

  const vaccineInfo = getVaccineInfo();
  const isFullyVaccinated = vaccineInfo && completedVaccinations.length >= vaccineInfo.dosesRequired;
  const dosesRemaining = vaccineInfo ? vaccineInfo.dosesRequired - completedVaccinations.length : 0;

  const getHospitalName = (hospitalId: string) => {
    const hospital = hospitals.find(h => h.id === hospitalId);
    return hospital?.name || 'Unknown Hospital';
  };

  // Prepare certificate data
  const getCertificateData = () => {
    if (!isFullyVaccinated || !vaccineInfo || !user) return null;
    return {
      patientName: user.name || 'Patient',
      patientId: user.id || '',
      dob: (user as any).dob || '1990-01-01',
      gender: (user as any).gender || 'Not specified',
      vaccineName: vaccineInfo.name,
      doses: completedVaccinations.map((v, index) => ({
        doseNumber: v.doseNumber,
        date: v.vaccinationDate,
        hospitalName: getHospitalName(v.hospitalId)
      })),
      certificateId: `COV-${user.id?.slice(-6).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
    };
  };

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name}!`}
      subtitle="Manage your appointments and health records"
    >
      {/* Vaccination Status Banner */}
      {vaccinations.length > 0 && (
        <Card className={`mb-6 ${isFullyVaccinated ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'}`}>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isFullyVaccinated ? 'bg-green-500/20' : 'bg-yellow-500/20'}`}>
                  {isFullyVaccinated ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {isFullyVaccinated ? '🎉 Fully Vaccinated!' : 'Vaccination In Progress'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isFullyVaccinated
                      ? `All ${vaccineInfo?.dosesRequired} doses of ${vaccineInfo?.name} completed`
                      : dosesRemaining > 0
                        ? `${dosesRemaining} dose(s) remaining for ${vaccineInfo?.name || 'your vaccine'}`
                        : 'No vaccination scheduled yet'
                    }
                  </p>
                </div>
              </div>
              {isFullyVaccinated && (
                <Button
                  onClick={() => setShowCertificate(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90"
                >
                  <Award className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Action Card (New Feature) */}
      <Card className="mb-6 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-500/20">
              <Sparkles className="h-6 w-6 text-violet-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">Recommended Action</h3>
              <p className="text-sm text-muted-foreground">
                {isFullyVaccinated
                  ? "You are fully protected! detailed report is available."
                  : completedVaccinations.length === 0
                    ? "Start your immunity journey today. Book your first dose."
                    : "Complete your vaccination schedule for full protection."}
              </p>
            </div>
            {isFullyVaccinated ? (
              <Button onClick={() => setShowCertificate(true)} variant="outline" className="border-violet-200 text-violet-700 bg-white/50 hover:bg-white/80">
                <Award className="mr-2 h-4 w-4" />
                Get Certificate
              </Button>
            ) : (
              <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
                <Link to="/patient/search-hospital">
                  {completedVaccinations.length === 0 ? "Book Dose 1" : "Book Dose 2"}
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* No Vaccination Message - Backup */}
      {vaccinations.length === 0 && (
        <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Syringe className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">No Vaccination Records</h3>
                <p className="text-sm text-muted-foreground">
                  You haven't received any COVID-19 vaccination yet. Book an appointment to get vaccinated.
                </p>
              </div>
              <Button asChild>
                <Link to="/patient/search-hospital">
                  Book Vaccination
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          icon={Calendar}
          variant="primary"
        />
        <StatCard
          title="Pending"
          value={pendingAppointments.length}
          icon={Clock}
          variant="default"
        />
        <StatCard
          title="Vaccinations"
          value={completedVaccinations.length}
          icon={Syringe}
          variant="secondary"
        />
        <StatCard
          title="Covid Tests"
          value={covidTests.length}
          icon={TestTube}
          variant="accent"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-lift group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary transition-colors">
                <Building2 className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Find Hospital</h3>
                <p className="text-sm text-muted-foreground">Search hospitals near you</p>
              </div>
              <Button size="icon" variant="ghost" asChild>
                <Link to="/patient/search-hospital">
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-secondary/10 group-hover:bg-secondary transition-colors">
                <Calendar className="h-6 w-6 text-secondary group-hover:text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">My Appointments</h3>
                <p className="text-sm text-muted-foreground">View all appointments</p>
              </div>
              <Button size="icon" variant="ghost" asChild>
                <Link to="/patient/appointments">
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-xl bg-accent group-hover:bg-accent transition-colors">
                <FileText className="h-6 w-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">View Reports</h3>
                <p className="text-sm text-muted-foreground">Test results & records</p>
              </div>
              <Button size="icon" variant="ghost" asChild>
                <Link to="/patient/reports">
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Your latest appointment activity</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/patient/appointments">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${appointment.purpose === 'Vaccination' ? 'bg-secondary/10' : 'bg-primary/10'}`}>
                      {appointment.purpose === 'Vaccination' ? (
                        <Syringe className="h-5 w-5 text-secondary" />
                      ) : (
                        <TestTube className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{appointment.purpose}</p>
                      <p className="text-sm text-muted-foreground">{getHospitalName(appointment.hospitalId)}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-medium text-foreground">{appointment.date}</p>
                      <p className="text-sm text-muted-foreground">{appointment.time}</p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No appointments yet</p>
              <Button className="mt-4" asChild>
                <Link to="/patient/search-hospital">Book Your First Appointment</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certificate Dialog */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vaccination Certificate</DialogTitle>
          </DialogHeader>
          {getCertificateData() && (
            <VaccinationCertificate {...getCertificateData()!} />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default PatientDashboard;

