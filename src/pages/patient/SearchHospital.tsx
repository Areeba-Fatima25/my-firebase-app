import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Calendar
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { cities, Hospital } from '@/lib/demoData';
import api from '@/lib/axios';

const SearchHospital = () => {
  const { role, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get('/hospitals?approved_only=true');
        if (response.data.success) {
          setHospitals(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch hospitals', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesCity = !searchCity || hospital.city === searchCity;
    const matchesQuery = !searchQuery ||
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesQuery;
  });

  return (
    <DashboardLayout
      title="Find Hospital"
      subtitle="Search for hospitals in your city to book appointments"
    >
      {/* Search Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by hospital name or address..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64 flex gap-2">
              <Select value={searchCity} onValueChange={setSearchCity}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {searchCity && (
                <Button variant="ghost" size="icon" onClick={() => setSearchCity('')}>
                  <span className="text-lg">×</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted-foreground">Loading hospitals...</div>
        ) : filteredHospitals.length > 0 ? (
          filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{hospital.name}</CardTitle>
                      <div className="flex items-center gap-1 text-secondary text-sm mt-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{hospital.address}, {hospital.city}</span>
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
                <Button className="w-full" onClick={() => navigate(`/patient/book-appointment/${hospital.id}`)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No hospitals found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or selecting a different city.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SearchHospital;
