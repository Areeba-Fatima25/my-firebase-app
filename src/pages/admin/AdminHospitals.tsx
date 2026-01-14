import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, Search, CheckCircle, XCircle, Clock, MapPin, Phone, Mail, Eye } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/status-badge';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const AdminHospitals = () => {
  const { role, hospitals, updateHospitalStatus } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<typeof hospitals[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  if (role !== 'admin') return <Navigate to="/admin/login" replace />;

  const pendingHospitals = hospitals.filter(h => h.status === 'Pending');
  const approvedHospitals = hospitals.filter(h => h.status === 'Approved');
  const rejectedHospitals = hospitals.filter(h => h.status === 'Rejected');

  const filteredHospitals = (list: typeof hospitals) =>
    list.filter(h =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleApprove = (hospital: typeof hospitals[0]) => {
    updateHospitalStatus(hospital.id, 'Approved');
    toast({
      title: "Hospital Approved",
      description: `${hospital.name} has been approved successfully.`,
    });
  };

  const handleReject = (hospital: typeof hospitals[0]) => {
    updateHospitalStatus(hospital.id, 'Rejected');
    toast({
      title: "Hospital Rejected",
      description: `${hospital.name} has been rejected.`,
      variant: "destructive"
    });
  };

  const HospitalCard = ({ hospital }: { hospital: typeof hospitals[0] }) => (
    <Card className="hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{hospital.name}</h3>
              <p className="text-sm text-muted-foreground">{hospital.city}</p>
            </div>
          </div>
          <StatusBadge status={hospital.status} />
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{hospital.address}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{hospital.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{hospital.email}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setSelectedHospital(hospital);
              setViewDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          {hospital.status === 'Pending' && (
            <>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => handleApprove(hospital)}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => handleReject(hospital)}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Hospital Management" subtitle="Manage and approve hospital registrations">
      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals by name or city..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-warning/10 border-warning/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-warning" />
            <div>
              <p className="text-2xl font-bold">{pendingHospitals.length}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/10 border-secondary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-2xl font-bold">{approvedHospitals.length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-8 w-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold">{rejectedHospitals.length}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingHospitals.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedHospitals.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedHospitals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals(pendingHospitals).length > 0 ? (
              filteredHospitals(pendingHospitals).map(h => <HospitalCard key={h.id} hospital={h} />)
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No pending hospitals</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals(approvedHospitals).length > 0 ? (
              filteredHospitals(approvedHospitals).map(h => <HospitalCard key={h.id} hospital={h} />)
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No approved hospitals</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rejected">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals(rejectedHospitals).length > 0 ? (
              filteredHospitals(rejectedHospitals).map(h => <HospitalCard key={h.id} hospital={h} />)
            ) : (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No rejected hospitals</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedHospital?.name}</DialogTitle>
            <DialogDescription>Hospital Details</DialogDescription>
          </DialogHeader>
          {selectedHospital && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedHospital.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedHospital.address}, {selectedHospital.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedHospital.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedHospital.email}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Registered on: {new Date(selectedHospital.created_at || new Date()).toLocaleDateString()}</p>
            </div>
          )}
          <DialogFooter>
            {selectedHospital?.status === 'Pending' && (
              <>
                <Button variant="destructive" onClick={() => { handleReject(selectedHospital); setViewDialogOpen(false); }}>
                  Reject
                </Button>
                <Button onClick={() => { handleApprove(selectedHospital); setViewDialogOpen(false); }}>
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminHospitals;
