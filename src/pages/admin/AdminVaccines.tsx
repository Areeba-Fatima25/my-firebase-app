import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pill, Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const AdminVaccines = () => {
  const { role } = useAuth();
  const { vaccines, addVaccine, updateVaccine, deleteVaccine } = useAppointments();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<typeof vaccines[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    dosesRequired: 2,
    available: true
  });

  if (role !== 'admin') return <Navigate to="/admin/login" replace />;

  const handleOpenDialog = (vaccine?: typeof vaccines[0]) => {
    if (vaccine) {
      setEditingVaccine(vaccine);
      setFormData({
        name: vaccine.name,
        manufacturer: vaccine.manufacturer,
        dosesRequired: vaccine.dosesRequired,
        available: vaccine.available
      });
    } else {
      setEditingVaccine(null);
      setFormData({ name: '', manufacturer: '', dosesRequired: 2, available: true });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.manufacturer) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (editingVaccine) {
      updateVaccine(editingVaccine.id, formData);
      toast({ title: "Vaccine Updated", description: `${formData.name} has been updated.` });
    } else {
      addVaccine(formData);
      toast({ title: "Vaccine Added", description: `${formData.name} has been added.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (vaccine: typeof vaccines[0]) => {
    deleteVaccine(vaccine.id);
    toast({ title: "Vaccine Deleted", description: `${vaccine.name} has been deleted.`, variant: "destructive" });
  };

  const toggleAvailability = (vaccine: typeof vaccines[0]) => {
    updateVaccine(vaccine.id, { available: !vaccine.available });
    toast({ 
      title: vaccine.available ? "Vaccine Disabled" : "Vaccine Enabled",
      description: `${vaccine.name} is now ${vaccine.available ? 'unavailable' : 'available'}.`
    });
  };

  return (
    <DashboardLayout title="Vaccine Management" subtitle="Manage available vaccines">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-secondary" />
              <div>
                <p className="text-xl font-bold">{vaccines.filter(v => v.available).length}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <XCircle className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-xl font-bold">{vaccines.filter(v => !v.available).length}</p>
                <p className="text-xs text-muted-foreground">Unavailable</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vaccine
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaccines.map(vaccine => (
          <Card key={vaccine.id} className={`hover-lift ${!vaccine.available && 'opacity-60'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${vaccine.available ? 'bg-secondary/10' : 'bg-muted'}`}>
                    <Pill className={`h-6 w-6 ${vaccine.available ? 'text-secondary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{vaccine.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{vaccine.manufacturer}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Doses Required</span>
                  <span className="font-medium">{vaccine.dosesRequired}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Availability</span>
                  <Switch 
                    checked={vaccine.available}
                    onCheckedChange={() => toggleAvailability(vaccine)}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenDialog(vaccine)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(vaccine)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingVaccine ? 'Edit Vaccine' : 'Add New Vaccine'}</DialogTitle>
            <DialogDescription>
              {editingVaccine ? 'Update vaccine details' : 'Add a new vaccine to the system'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vaccine Name</Label>
              <Input
                placeholder="e.g., Covishield"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Manufacturer</Label>
              <Input
                placeholder="e.g., Serum Institute of India"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Doses Required</Label>
              <Input
                type="number"
                min="1"
                max="4"
                value={formData.dosesRequired}
                onChange={(e) => setFormData({ ...formData, dosesRequired: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Available</Label>
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingVaccine ? 'Update' : 'Add'} Vaccine</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminVaccines;
