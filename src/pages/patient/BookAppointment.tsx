import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2,
  Calendar,
  Clock,
  Syringe,
  TestTube,
  ArrowLeft,
  MapPin,
  Phone
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { Hospital } from '@/lib/demoData';

const BookAppointment = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const { user, role, hospitals } = useAuth();
  const { createAppointment } = useAppointments();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    purpose: '',
    date: '',
    time: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [fetchingHospital, setFetchingHospital] = useState(true);

  if (role !== 'patient') {
    return <Navigate to="/patient/login" replace />;
  }

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      if (!hospitalId) return;
      try {
        setFetchingHospital(true);
        const response = await api.get(`/hospitals/${hospitalId}`);
        if (response.data.success) {
          setHospital(response.data.data);
        } else {
          toast({
            title: "Error",
            description: "Could not find hospital details",
            variant: "destructive"
          });
          navigate('/patient/search-hospital');
        }
      } catch (error) {
        console.error("Failed to fetch hospital details", error);
        toast({
          title: "Error",
          description: "Failed to load hospital details",
          variant: "destructive"
        });
        navigate('/patient/search-hospital');
      } finally {
        setFetchingHospital(false);
      }
    };

    fetchHospitalDetails();
  }, [hospitalId, navigate, toast]);

  if (fetchingHospital) {
    return (
      <DashboardLayout title="Book Appointment" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!hospital) {
    return <Navigate to="/patient/search-hospital" replace />;
  }

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createAppointment({
        patientId: user?.id || '',
        hospitalId: hospital.id,
        purpose: formData.purpose as 'Covid Test' | 'Vaccination',
        date: formData.date,
        time: formData.time
      });

      toast({
        title: 'Appointment booked!',
        description: 'Your appointment request has been submitted. Wait for hospital approval.',
      });
      navigate('/patient/appointments');
    } catch (error: any) {
      console.error('Booking failed:', error);
      toast({
        title: 'Booking Failed',
        description: error.response?.data?.message || 'There was an error booking your appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout
      title="Book Appointment"
      subtitle="Schedule your visit to the hospital"
    >
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Hospital Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{hospital.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 mt-0.5" />
              <div>
                <p>{hospital.address}</p>
                <p>{hospital.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <span>{hospital.phone}</span>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Fill in the details to book your appointment</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Purpose of Visit</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={formData.purpose === 'Covid Test' ? 'default' : 'outline'}
                    className="h-24 flex flex-col gap-2"
                    onClick={() => setFormData({ ...formData, purpose: 'Covid Test' })}
                  >
                    <TestTube className="h-8 w-8" />
                    <span>Covid Test</span>
                  </Button>
                  <Button
                    type="button"
                    variant={formData.purpose === 'Vaccination' ? 'default' : 'outline'}
                    className="h-24 flex flex-col gap-2"
                    onClick={() => setFormData({ ...formData, purpose: 'Vaccination' })}
                  >
                    <Syringe className="h-8 w-8" />
                    <span>Vaccination</span>
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="date"
                      type="date"
                      className="pl-10"
                      min={today}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Select Time Slot</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData({ ...formData, time: value })}
                  >
                    <SelectTrigger>
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Choose time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-2">Important Note</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your appointment is subject to hospital approval</li>
                  <li>• Please carry a valid ID proof</li>
                  <li>• Arrive 15 minutes before your scheduled time</li>
                  <li>• Wear a mask during your visit</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || !formData.purpose || !formData.date || !formData.time}
              >
                {isLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
