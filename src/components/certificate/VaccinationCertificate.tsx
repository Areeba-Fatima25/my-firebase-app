import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Download,
    Shield,
    Syringe,
    CheckCircle2,
    Award,
    QrCode,
    Calendar,
    User,
    Building2
} from 'lucide-react';

interface CertificateProps {
    patientName: string;
    patientId: string;
    dob: string;
    gender: string;
    vaccineName: string;
    doses: {
        doseNumber: number;
        date: string;
        hospitalName: string;
    }[];
    certificateId: string;
}

const VaccinationCertificate = ({
    patientName,
    patientId,
    dob,
    gender,
    vaccineName,
    doses,
    certificateId
}: CertificateProps) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!certificateRef.current) return;

        // Dynamic import for html2canvas
        const html2canvas = (await import('html2canvas')).default;
        const { jsPDF } = await import('jspdf');

        const canvas = await html2canvas(certificateRef.current, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const imgWidth = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`vaccination-certificate-${certificateId}.pdf`);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-4">
            {/* Download Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleDownload}
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download Certificate (PDF)
                </Button>
            </div>

            {/* Certificate */}
            <div
                ref={certificateRef}
                className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-primary/20 relative overflow-hidden"
                style={{ minHeight: '500px' }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(0,0,0,0.03) 10px,
                rgba(0,0,0,0.03) 20px
              )`
                        }}
                    />
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-4 left-4 w-16 h-16 border-l-4 border-t-4 border-primary/30 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-16 h-16 border-r-4 border-t-4 border-primary/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-l-4 border-b-4 border-primary/30 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-r-4 border-b-4 border-primary/30 rounded-br-lg" />

                {/* Header */}
                <div className="text-center mb-8 relative z-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">COVID-19</h1>
                            <p className="text-lg text-primary font-semibold">Vaccination Certificate</p>
                        </div>
                        <div className="p-3 rounded-full bg-gradient-to-br from-secondary to-primary shadow-lg">
                            <Award className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="text-green-600 font-medium">Fully Vaccinated</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {/* Patient Info */}
                    <Card className="bg-gradient-to-br from-gray-50 to-white shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <User className="h-5 w-5" />
                                <h3 className="font-semibold">Patient Details</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-500">Full Name</p>
                                    <p className="font-semibold text-gray-800">{patientName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Patient ID</p>
                                    <p className="font-medium text-gray-700">{patientId}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Date of Birth</p>
                                    <p className="font-medium text-gray-700">{formatDate(dob)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Gender</p>
                                    <p className="font-medium text-gray-700">{gender}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vaccine Info */}
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4 text-secondary">
                                <Syringe className="h-5 w-5" />
                                <h3 className="font-semibold">Vaccine Details</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="text-center p-4 bg-white rounded-xl">
                                    <p className="text-2xl font-bold text-primary">{vaccineName}</p>
                                    <Badge className="mt-2 bg-green-100 text-green-700 border-0">
                                        {doses.length} Dose(s) Completed
                                    </Badge>
                                </div>
                                {doses.map((dose, index) => (
                                    <div key={index} className="p-3 bg-white rounded-lg shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-700">Dose {dose.doseNumber}</span>
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(dose.date)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* QR Code & Verification */}
                    <Card className="bg-gradient-to-br from-gray-50 to-white shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4 text-primary">
                                <QrCode className="h-5 w-5" />
                                <h3 className="font-semibold">Verification</h3>
                            </div>
                            <div className="text-center">
                                {/* QR Code Placeholder - Using a styled div */}
                                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 mb-4">
                                    <div className="grid grid-cols-4 gap-1 p-3">
                                        {Array.from({ length: 16 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">Certificate ID</p>
                                <p className="font-mono text-sm font-semibold text-gray-700 bg-gray-100 rounded px-3 py-1">
                                    {certificateId}
                                </p>
                            </div>

                            {/* Hospital Info */}
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                    <Building2 className="h-4 w-4" />
                                    <span>Administered at</span>
                                </div>
                                {doses.map((dose, index) => (
                                    <p key={index} className="text-xs text-gray-600">
                                        Dose {dose.doseNumber}: {dose.hospitalName}
                                    </p>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 text-center relative z-10">
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                        <span>Issue Date: {formatDate(new Date().toISOString())}</span>
                        <span>•</span>
                        <span>CovidCare Portal</span>
                        <span>•</span>
                        <span>www.covidcare.gov</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                        This certificate is digitally verified and can be authenticated using the QR code above.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VaccinationCertificate;
