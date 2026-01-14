import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    Search,
    Calendar,
    Phone,
    Mail,
    MapPin,
    Syringe,
    TestTube,

    Eye,
    MessageSquare,
    Send
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import StatusBadge from '@/components/ui/status-badge';

const HospitalPatients = () => {
    const { user, role, patients } = useAuth();
    const { appointments, covidTests, vaccinations } = useAppointments();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'test' | 'vaccination'>('all');
    const [showApprovedOnly, setShowApprovedOnly] = useState(true); // Default to true as per strict requirement

    // Request Dialog State
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [requestType, setRequestType] = useState<'reminder' | 'custom'>('reminder');

    if (role !== 'hospital') return <Navigate to="/hospital/login" replace />;

    // Get patients who have appointments with this hospital
    // Get patients who have appointments with this hospital
    // Aggregating patients from Appointments, Covid Tests, and Vaccinations
    const uniquePatientsMap = new Map();

    const hospitalAppointments = appointments.filter(a => a.hospitalId === user?.id);
    const hospitalTests = covidTests.filter(t => t.hospitalId === user?.id);
    const hospitalVaccinations = vaccinations.filter(v => v.hospitalId === user?.id);

    // Add patients from Appointments
    hospitalAppointments.forEach(app => {
        if (app.patient && !uniquePatientsMap.has(app.patientId)) {
            uniquePatientsMap.set(app.patientId, app.patient);
        }
    });

    // Add patients from Covid Tests
    hospitalTests.forEach(test => {
        if (test.patient && !uniquePatientsMap.has(test.patientId)) {
            uniquePatientsMap.set(test.patientId, test.patient);
        }
    });

    // Add patients from Vaccinations
    hospitalVaccinations.forEach(vax => {
        if (vax.patient && !uniquePatientsMap.has(vax.patientId)) {
            uniquePatientsMap.set(vax.patientId, vax.patient);
        }
    });

    const hospitalPatients = Array.from(uniquePatientsMap.values());

    // Apply search filter
    const filteredPatients = hospitalPatients.filter(patient => {
        const matchesSearch =
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.mobile.includes(searchQuery);

        if (!matchesSearch) return false;

        // Strict Filter: "who are all approve"
        // Check if patient has at least one approved appointment/test/vaccination with this hospital
        if (showApprovedOnly) {
            const hasApprovedAppt = hospitalAppointments.some(a => a.patientId === patient.id && a.status === 'Approved');
            const hasApprovedTest = hospitalTests.some(t => t.patientId === patient.id && t.result); // Result exists = processed
            const hasApprovedVax = hospitalVaccinations.some(v => v.patientId === patient.id && v.status === 'Completed');

            if (!hasApprovedAppt && !hasApprovedTest && !hasApprovedVax) return false;
        }

        if (filterType === 'all') return true;

        if (filterType === 'test') {
            return covidTests.some(t => t.patientId === patient.id && t.hospitalId === user?.id);
        }
        if (filterType === 'vaccination') {
            return vaccinations.some(v => v.patientId === patient.id && v.hospitalId === user?.id);
        }
        return true;
    });

    const handleOpenRequestDialog = (patient: any) => {
        setSelectedPatient(patient);
        setIsRequestDialogOpen(true);
        setRequestMessage(`Dear ${patient.name}, this is a reminder from ${user?.name} regarding your upcoming schedule.`);
    };

    const handleSendRequest = () => {
        // In a real app, this would make an API call to store the notification
        toast({
            title: "Request Sent",
            description: `Notification sent to ${selectedPatient?.name}`,
        });
        setIsRequestDialogOpen(false);
        setSelectedPatient(null);
    };

    const getPatientStats = (patientId: string) => {
        const patientAppointments = hospitalAppointments.filter(a => a.patientId === patientId);
        const patientTests = covidTests.filter(t => t.patientId === patientId && t.hospitalId === user?.id);
        const patientVaccinations = vaccinations.filter(v => v.patientId === patientId && v.hospitalId === user?.id);

        return {
            appointments: patientAppointments.length,
            tests: patientTests.length,
            vaccinations: patientVaccinations.length,
            latestAppointment: patientAppointments[0]
        };
    };

    return (
        <DashboardLayout title="Patient List" subtitle="All patients with appointments at your hospital">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search patients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border">
                            <Switch
                                checked={showApprovedOnly}
                                onCheckedChange={setShowApprovedOnly}
                                id="approved-filter"
                            />
                            <Label htmlFor="approved-filter" className="text-sm cursor-pointer">Approved Only</Label>
                        </div>
                        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="test">Tests</TabsTrigger>
                                <TabsTrigger value="vaccination">Vaccines</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-primary/20">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{hospitalPatients.length}</p>
                                <p className="text-sm text-muted-foreground">Total Patients</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-secondary/20">
                                <TestTube className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {hospitalAppointments.filter(a => a.purpose === 'Covid Test').length}
                                </p>
                                <p className="text-sm text-muted-foreground">Test Requests</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-accent/20">
                                <Syringe className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {hospitalAppointments.filter(a => a.purpose === 'Vaccination').length}
                                </p>
                                <p className="text-sm text-muted-foreground">Vaccination Requests</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Patient List */}
            <div className="grid gap-4">
                {filteredPatients.length > 0 ? filteredPatients.map(patient => {
                    const stats = getPatientStats(patient.id);
                    return (
                        <Card key={patient.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                                            <div className="space-y-1 mt-1">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    <span>{patient.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{patient.mobile}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{patient.city}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="text-center p-3 bg-muted/50 rounded-xl min-w-[80px]">
                                            <p className="text-xl font-bold text-primary">{stats.appointments}</p>
                                            <p className="text-xs text-muted-foreground">Appointments</p>
                                        </div>
                                        <div className="text-center p-3 bg-muted/50 rounded-xl min-w-[80px]">
                                            <p className="text-xl font-bold text-secondary">{stats.tests}</p>
                                            <p className="text-xs text-muted-foreground">Tests</p>
                                        </div>
                                        <div className="text-center p-3 bg-muted/50 rounded-xl min-w-[80px]">
                                            <p className="text-xl font-bold text-accent">{stats.vaccinations}</p>
                                            <p className="text-xs text-muted-foreground">Vaccinations</p>
                                        </div>
                                    </div>

                                    {stats.latestAppointment && (
                                        <div className="md:text-right">
                                            <p className="text-sm font-medium mb-1">Latest Appointment</p>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>{stats.latestAppointment.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1 mb-2 justify-end">
                                                <Badge variant="outline" className="text-xs">
                                                    {stats.latestAppointment.purpose}
                                                </Badge>
                                                <StatusBadge status={stats.latestAppointment.status} />
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => handleOpenRequestDialog(patient)}>
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Send Request
                                            </Button>
                                        </div>
                                    )}
                                    {!stats.latestAppointment && (
                                        <div className="md:text-right">
                                            <Button size="sm" variant="outline" onClick={() => handleOpenRequestDialog(patient)}>
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Send Request
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                }) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                            <p className="text-muted-foreground">
                                {searchQuery ? 'No patients match your search' : 'No patients found'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Send Request to {selectedPatient?.name}</DialogTitle>
                        <DialogDescription>
                            Send a notification or reminder to this patient.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Message Type</Label>
                            <div className="flex gap-2">
                                <Button
                                    variant={requestType === 'reminder' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setRequestType('reminder');
                                        setRequestMessage(`Dear ${selectedPatient?.name}, this is a reminder from ${user?.name} regarding your upcoming schedule.`);
                                    }}
                                    className="flex-1"
                                >
                                    Reminder
                                </Button>
                                <Button
                                    variant={requestType === 'custom' ? 'default' : 'outline'}
                                    onClick={() => {
                                        setRequestType('custom');
                                        setRequestMessage('');
                                    }}
                                    className="flex-1"
                                >
                                    Custom
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                rows={4}
                                placeholder="Type your message here..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSendRequest}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Notification
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
};

export default HospitalPatients;
