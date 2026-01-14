import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Syringe, TestTube, Calendar, Building2, CheckCircle, Download, Award, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { generateVaccinationCertificate } from '@/lib/certificateGenerator';
import { toast } from '@/hooks/use-toast';

const PatientReports = () => {
  const { user, role, hospitals, isLoading } = useAuth();
  const { getPatientCovidTests, getPatientVaccinations, vaccines } = useAppointments();

  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (role !== 'patient') return <Navigate to="/patient/login" replace />;

  const covidTests = getPatientCovidTests(user?.id || '');
  const vaccinations = getPatientVaccinations(user?.id || '');


  const getVaccineName = (id: string) => vaccines.find(v => String(v.id) === String(id))?.name || 'Unknown';

  // Check if eligible for certificate (completed required doses for the vaccine)
  const completedVaccinations = vaccinations.filter(v => v.status === 'Completed');

  // Get the vaccine's required doses (if any vaccinations exist)
  const firstVaccination = completedVaccinations[0];
  const vaccineUsed = firstVaccination ? vaccines.find(v => v.id === firstVaccination.vaccineId) : null;
  const requiredDoses = vaccineUsed?.dosesRequired || 2;

  const isEligibleForCertificate = completedVaccinations.length >= requiredDoses;

  const handleDownloadCertificate = () => {
    if (!user || !isEligibleForCertificate) return;

    const certNumber = generateVaccinationCertificate({
      patient: user as any,
      vaccinations: completedVaccinations,
      vaccines
    });

    if (certNumber) {
      toast({
        title: 'Certificate Downloaded!',
        description: `Your vaccination certificate (${certNumber}) has been saved.`
      });
    }
  };

  const handlePreviewCertificate = () => {
    if (!user || !isEligibleForCertificate) return;

    const dataUrl = generateVaccinationCertificate({
      patient: user as any,
      vaccinations: completedVaccinations,
      vaccines
    }, 'preview');

    if (dataUrl) {
      window.open(dataUrl, '_blank');
    }
  };

  return (
    <DashboardLayout title="My Reports" subtitle="View your test results and vaccination records">
      {/* Certificate Banner */}
      {isEligibleForCertificate && (
        <Card className="mb-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-500/20">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-green-700">Fully Vaccinated!</h3>
                  <p className="text-sm text-muted-foreground">You have completed your COVID-19 vaccination course.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePreviewCertificate} className="bg-white/50 hover:bg-white/80 border-green-200 text-green-700">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button onClick={handleDownloadCertificate} className="bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="vaccinations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="vaccinations">Vaccinations ({vaccinations.length})</TabsTrigger>
          <TabsTrigger value="tests">Covid Tests ({covidTests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="vaccinations">
          <div className="grid md:grid-cols-2 gap-6">
            {vaccinations.length > 0 ? vaccinations.map((v) => (
              <Card key={v.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-secondary/10">
                      <Syringe className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{getVaccineName(v.vaccineId)}</h3>
                      <p className="text-sm text-muted-foreground">Dose {v.doseNumber}</p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Building2 className="h-4 w-4" />{v.hospital?.name || 'Unknown'}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{v.vaccinationDate}</div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="col-span-full"><CardContent className="py-12 text-center">
                <Syringe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No vaccination records found</p>
              </CardContent></Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tests">
          <div className="grid md:grid-cols-2 gap-6">
            {covidTests.length > 0 ? covidTests.map((t) => (
              <Card key={t.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <TestTube className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">RT-PCR Test</h3>
                      <p className="text-sm text-muted-foreground">{t.testDate}</p>
                    </div>
                    <StatusBadge status={t.result} />
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Building2 className="h-4 w-4" />{t.hospital?.name || 'Unknown'}</div>
                    <p className="mt-2 p-3 bg-muted/50 rounded-lg">{t.remarks}</p>
                    {t.file_path && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full"
                        asChild
                      >
                        <a
                          href={`http://localhost:8000/storage/${t.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Report
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="col-span-full"><CardContent className="py-12 text-center">
                <TestTube className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No test records found</p>
              </CardContent></Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default PatientReports;
