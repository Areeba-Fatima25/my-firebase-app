import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, Syringe, TestTube, Clock, CheckCircle, XCircle, MapPin, FileUp, AlertTriangle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const HospitalAppointments = () => {
  const { user, role, patients } = useAuth();
  const { getHospitalAppointments, updateAppointmentStatus, addCovidTest, addVaccination, vaccines, vaccinations, getHospitalVaccinations, covidTests } = useAppointments();
  const [actionDialog, setActionDialog] = useState<{ open: boolean; appointment: any; action: 'approve' | 'reject' | 'test' | 'vaccine' | null }>({
    open: false,
    appointment: null,
    action: null
  });
  const [testResult, setTestResult] = useState<'Positive' | 'Negative'>('Negative');
  const [testRemarks, setTestRemarks] = useState('');
  const [testFile, setTestFile] = useState<File | null>(null);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [doseNumber, setDoseNumber] = useState(1);
  const [doseWarning, setDoseWarning] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  if (role !== 'hospital') return <Navigate to="/hospital/login" replace />;

  const appointments = getHospitalAppointments(user?.id || '');
  const pending = appointments.filter(a => a.status === 'Pending');
  const approved = appointments.filter(a => a.status === 'Approved');
  const rejected = appointments.filter(a => a.status === 'Rejected');



  const handleApprove = (appointment: any) => {
    updateAppointmentStatus(appointment.id, 'Approved');
    toast({ title: "Appointment Approved", description: "Patient has been notified." });
    setActionDialog({ open: false, appointment: null, action: null });
  };

  const handleReject = (appointment: any) => {
    updateAppointmentStatus(appointment.id, 'Rejected');
    toast({ title: "Appointment Rejected", description: "Patient has been notified.", variant: "destructive" });
    setActionDialog({ open: false, appointment: null, action: null });
  };

  const handleAddTest = () => {
    if (!actionDialog.appointment) return;
    addCovidTest({
      appointmentId: actionDialog.appointment.id,
      patientId: actionDialog.appointment.patientId,
      hospitalId: user?.id || '',
      result: testResult,
      testDate: new Date().toISOString().split('T')[0],
      remarks: testRemarks || 'RT-PCR test conducted.',
      file: testFile
    });

    toast({ title: "Report Sent", description: "The covid test report was sent successfully." });
    setActionDialog({ open: false, appointment: null, action: null });
    setTestRemarks('');
    setTestFile(null);
  };

  const handleAddVaccination = () => {
    if (!actionDialog.appointment || !selectedVaccine) return;

    // Get the selected vaccine's dose limit
    const vaccine = vaccines.find(v => v.id === selectedVaccine);
    const maxDoses = vaccine?.dosesRequired || 2;

    // Get patient's existing vaccinations for this vaccine
    const patientId = actionDialog.appointment.patientId;
    const existingDoses = vaccinations.filter(
      v => v.patientId === patientId && v.vaccineId === selectedVaccine && v.status === 'Completed'
    ).length;

    // Check if dose limit would be exceeded
    if (existingDoses >= maxDoses) {
      setDoseWarning({
        open: true,
        message: `Dose limit reached! ${vaccine?.name || 'This vaccine'} requires only ${maxDoses} dose(s). Patient has already received ${existingDoses} dose(s).`
      });
      return;
    }

    // Auto-set the dose number based on existing doses
    const nextDose = existingDoses + 1;

    addVaccination({
      appointmentId: actionDialog.appointment.id,
      patientId: actionDialog.appointment.patientId,
      hospitalId: user?.id || '',
      vaccineId: selectedVaccine,
      doseNumber: nextDose,
      status: 'Completed',
      vaccinationDate: new Date().toISOString().split('T')[0]
    });
    toast({ title: "Vaccination Recorded", description: `Dose ${nextDose} of ${maxDoses} completed.` });
    setActionDialog({ open: false, appointment: null, action: null });
    setSelectedVaccine('');
    setDoseNumber(1);
  };

  const AppointmentCard = ({ appointment }: { appointment: typeof appointments[0] }) => {
    return (
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

          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{appointment.patient?.name || 'Unknown'}</span>
            </div>
            {appointment.patient && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{appointment.patient.city}</span>
              </div>
            )}
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

          {appointment.status === 'Pending' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => setActionDialog({ open: true, appointment, action: 'approve' })}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => setActionDialog({ open: true, appointment, action: 'reject' })}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}

          {appointment.status === 'Approved' && (() => {
            const hasTest = covidTests.some(t => String(t.appointmentId) === String(appointment.id));
            const hasVaccination = vaccinations.some(v => String(v.appointmentId) === String(appointment.id));

            return (
              <Button
                size="sm"
                className="w-full"
                variant={hasTest || hasVaccination ? "outline" : "secondary"}
                onClick={() => setActionDialog({
                  open: true,
                  appointment,
                  action: appointment.purpose === 'Covid Test' ? 'test' : 'vaccine'
                })}
              >
                {appointment.purpose === 'Covid Test' ? (
                  <>
                    <TestTube className="h-4 w-4 mr-1" />
                    {hasTest ? 'Update Result' : 'Add Test Result'}
                  </>
                ) : (
                  <>
                    <Syringe className="h-4 w-4 mr-1" />
                    {hasVaccination ? 'Vaccination Recorded' : 'Record Vaccination'}
                  </>
                )}
              </Button>
            );
          })()}
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout title="Manage Appointments" subtitle="View and manage patient appointments">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-warning/10">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-warning" />
            <div>
              <p className="text-xl font-bold">{pending.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-secondary" />
            <div>
              <p className="text-xl font-bold">{approved.length}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-6 w-6 text-destructive" />
            <div>
              <p className="text-xl font-bold">{rejected.length}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
          <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.length > 0 ? pending.map(a => <AppointmentCard key={a.id} appointment={a} />) : (
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.length > 0 ? approved.map(a => <AppointmentCard key={a.id} appointment={a} />) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No approved appointments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rejected.length > 0 ? rejected.map(a => <AppointmentCard key={a.id} appointment={a} />) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <XCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No rejected appointments</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map(a => <AppointmentCard key={a.id} appointment={a} />)}
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'approve' && 'Approve Appointment'}
              {actionDialog.action === 'reject' && 'Reject Appointment'}
              {actionDialog.action === 'test' && 'Add Covid Test Result'}
              {actionDialog.action === 'vaccine' && 'Record Vaccination'}
            </DialogTitle>
            <DialogDescription>
              Patient: {actionDialog.appointment?.patient?.name || 'Unknown'}
            </DialogDescription>
          </DialogHeader>

          {actionDialog.action === 'test' && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Test Result</Label>
                <Select value={testResult} onValueChange={(v: 'Positive' | 'Negative') => setTestResult(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Negative">Negative</SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea
                  placeholder="Additional notes..."
                  value={testRemarks}
                  onChange={(e) => setTestRemarks(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Report File (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setTestFile(e.target.files?.[0] || null)}
                    className="flex-1"
                  />
                  {testFile && <FileUp className="h-5 w-5 text-secondary" />}
                </div>
                <p className="text-xs text-muted-foreground">PDF, JPG, or PNG. Max 5MB.</p>
              </div>
            </div>
          )}

          {actionDialog.action === 'vaccine' && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Vaccine</Label>
                <Select value={selectedVaccine} onValueChange={setSelectedVaccine}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccine" />
                  </SelectTrigger>
                  <SelectContent>
                    {vaccines.filter(v => v.available).map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dose Information</Label>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {selectedVaccine ? (() => {
                    const vaccine = vaccines.find(v => v.id === selectedVaccine);
                    const maxDoses = vaccine?.dosesRequired || 2;
                    const patientId = actionDialog.appointment?.patientId;
                    const existingDoses = vaccinations.filter(
                      v => v.patientId === patientId && v.vaccineId === selectedVaccine && v.status === 'Completed'
                    ).length;
                    const nextDose = existingDoses + 1;

                    if (nextDose > maxDoses) {
                      return <span className="text-destructive font-semibold">Max doses ({maxDoses}) reached! Cannot administer more.</span>;
                    }
                    return <span>Next Dose: <span className="font-bold">{nextDose}</span> / {maxDoses}</span>;
                  })() : <span className="text-muted-foreground">Select a vaccine to see dose info</span>}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, appointment: null, action: null })}>
              Cancel
            </Button>
            {actionDialog.action === 'approve' && (
              <Button onClick={() => handleApprove(actionDialog.appointment)}>Approve</Button>
            )}
            {actionDialog.action === 'reject' && (
              <Button variant="destructive" onClick={() => handleReject(actionDialog.appointment)}>Reject</Button>
            )}
            {actionDialog.action === 'test' && (
              <Button onClick={handleAddTest}>Save Result</Button>
            )}
            {actionDialog.action === 'vaccine' && (
              <Button onClick={handleAddVaccination} disabled={!selectedVaccine}>
                Record Vaccination
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dose Warning Dialog */}
      <Dialog open={doseWarning.open} onOpenChange={(open) => setDoseWarning({ ...doseWarning, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Excess Dose Warning
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">{doseWarning.message}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDoseWarning({ ...doseWarning, open: false })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default HospitalAppointments;
