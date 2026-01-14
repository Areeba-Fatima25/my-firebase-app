import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  BarChart3,
  Syringe,
  TestTube,
  TrendingUp,
  Calendar,
  Building2,
  Download,
  RefreshCw
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentContext';
import { dashboardStats } from '@/lib/demoData';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";

const AdminReports = () => {
  const { role, hospitals, patients } = useAuth();
  const { appointments, vaccinations, covidTests } = useAppointments();
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<'week' | 'month' | 'all' | 'custom'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isExporting, setIsExporting] = useState(false);

  if (role !== 'admin') return <Navigate to="/admin/login" replace />;

  // Filter data by date range
  const filterByDate = <T extends { date?: string; vaccinationDate?: string; testDate?: string }>(items: T[]) => {
    if (filterType === 'all') return items;

    const now = new Date();
    let start = new Date();
    let end = new Date();

    if (filterType === 'week') {
      start.setDate(now.getDate() - 7);
    } else if (filterType === 'month') {
      start.setMonth(now.getMonth() - 1);
    } else if (filterType === 'custom') {
      if (!dateRange?.from) return items;
      start = dateRange.from;
      end = dateRange.to || dateRange.from;
    }

    // Ensure start is start of day and end is end of day
    start = startOfDay(start);
    end = endOfDay(end);

    return items.filter(item => {
      const itemDateStr = item.date || item.vaccinationDate || item.testDate || '';
      if (!itemDateStr) return false;

      const itemDate = new Date(itemDateStr);
      return isWithinInterval(itemDate, { start, end });
    });
  };

  const filteredAppointments = filterByDate(appointments);
  const filteredVaccinations = filterByDate(vaccinations);
  const filteredCovidTests = filterByDate(covidTests);

  const [monthlyData, setMonthlyData] = useState<{ month: string; vaccinations: number; tests: number }[]>([]);

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        const response = await import('@/lib/axios').then(m => m.default.get('/dashboard/monthly-stats'));
        if (response.data.success) {
          const { vaccinations, tests } = response.data.data;
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          const formattedData = monthNames.map((name, index) => ({
            month: name,
            vaccinations: vaccinations[index + 1] || 0,
            tests: tests[index + 1] || 0
          }));
          setMonthlyData(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch monthly stats:', error);
      }
    };

    fetchMonthlyStats();
  }, []);

  const appointmentsByStatus = [
    { name: 'Approved', value: filteredAppointments.filter(a => a.status === 'Approved').length, color: 'hsl(var(--secondary))' },
    { name: 'Pending', value: filteredAppointments.filter(a => a.status === 'Pending').length, color: 'hsl(var(--warning))' },
    { name: 'Rejected', value: filteredAppointments.filter(a => a.status === 'Rejected').length, color: 'hsl(var(--destructive))' },
  ];

  const hospitalsByCity = hospitals.reduce((acc, h) => {
    const existing = acc.find(item => item.city === h.city);
    if (existing) existing.count++;
    else acc.push({ city: h.city, count: 1 });
    return acc;
  }, [] as { city: string; count: number }[]);

  const handleExportXLS = async () => {
    setIsExporting(true);
    try {
      // Dynamic import xlsx
      const XLSX = await import('xlsx');

      // Prepare data sheets
      const appointmentsData = filteredAppointments.map(a => ({
        'Appointment ID': a.id,
        'Patient ID': a.patientId,
        'Hospital ID': a.hospitalId,
        'Date': a.date,
        'Time': a.time,
        'Purpose': a.purpose,
        'Status': a.status
      }));

      const vaccinationsData = filteredVaccinations.map(v => ({
        'Vaccination ID': v.id,
        'Patient ID': v.patientId,
        'Hospital ID': v.hospitalId,
        'Vaccine ID': v.vaccineId,
        'Dose Number': v.doseNumber,
        'Date': v.vaccinationDate,
        'Status': v.status
      }));

      const testsData = filteredCovidTests.map(t => ({
        'Test ID': t.id,
        'Patient ID': t.patientId,
        'Hospital ID': t.hospitalId,
        'Test Date': t.testDate,
        'Result': t.result
      }));

      const summaryData = [
        { 'Metric': 'Total Appointments', 'Value': filteredAppointments.length },
        { 'Metric': 'Approved Appointments', 'Value': filteredAppointments.filter(a => a.status === 'Approved').length },
        { 'Metric': 'Pending Appointments', 'Value': filteredAppointments.filter(a => a.status === 'Pending').length },
        { 'Metric': 'Total Vaccinations', 'Value': filteredVaccinations.length },
        { 'Metric': 'Total Covid Tests', 'Value': filteredCovidTests.length },
        { 'Metric': 'Total Hospitals', 'Value': hospitals.length },
        { 'Metric': 'Total Patients', 'Value': patients.length },
        { 'Metric': 'Filter Type', 'Value': filterType.charAt(0).toUpperCase() + filterType.slice(1) },
        {
          'Metric': 'Date Range', 'Value': filterType === 'custom' && dateRange?.from ?
            `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString() || dateRange.from.toLocaleDateString()}` :
            'N/A'
        },
        { 'Metric': 'Report Generated', 'Value': new Date().toLocaleString() }
      ];

      // Create workbook with multiple sheets
      const workbook = XLSX.utils.book_new();

      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

      const appointmentsSheet = XLSX.utils.json_to_sheet(appointmentsData);
      XLSX.utils.book_append_sheet(workbook, appointmentsSheet, 'Appointments');

      const vaccinationsSheet = XLSX.utils.json_to_sheet(vaccinationsData);
      XLSX.utils.book_append_sheet(workbook, vaccinationsSheet, 'Vaccinations');

      const testsSheet = XLSX.utils.json_to_sheet(testsData);
      XLSX.utils.book_append_sheet(workbook, testsSheet, 'Covid Tests');

      // Generate and download
      const fileName = `covid_reports_${filterType}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast({
        title: 'Export Successful',
        description: `Report exported as ${fileName}`
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export report. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout title="Reports & Analytics" subtitle="View detailed statistics and reports">
      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex items-center gap-4">
          <Select value={filterType} onValueChange={(v) => {
            setFilterType(v as any);
            if (v !== 'custom') setDateRange(undefined);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {filterType === 'custom' && (
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          )}

          <Button variant="outline" size="icon" onClick={() => {
            setFilterType('all');
            setDateRange(undefined);
          }}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleExportXLS}
          disabled={isExporting}
          className="bg-gradient-to-r from-primary to-secondary"
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export to Excel'}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20">
                <Syringe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredVaccinations.length.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Vaccinations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-secondary/20">
                <TestTube className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredCovidTests.length.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Covid Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-accent/20">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredAppointments.length}</p>
                <p className="text-sm text-muted-foreground">Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/20">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">+24%</p>
                <p className="text-sm text-muted-foreground">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Vaccinations & Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="vaccinations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="tests" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-sm text-muted-foreground">Vaccinations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-secondary" />
                <span className="text-sm text-muted-foreground">Tests</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointments by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {appointmentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospitals by City */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Hospitals by City
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hospitalsByCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="city" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminReports;

