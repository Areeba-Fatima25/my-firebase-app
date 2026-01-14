import { jsPDF } from 'jspdf';
import { Patient, Vaccination, Vaccine, Hospital } from '@/lib/demoData';

interface CertificateData {
    patient: Patient;
    vaccinations: Vaccination[];
    vaccines: Vaccine[];
    hospital?: Hospital;
}


export const generateVaccinationCertificate = (data: CertificateData, action: 'download' | 'preview' = 'download') => {
    const { patient, vaccinations, vaccines } = data;

    // Check if patient has completed required doses for their vaccine
    const completedVaccinations = vaccinations.filter(v => v.status === 'Completed');

    if (completedVaccinations.length === 0) {
        return null;
    }

    // Get the vaccine used (use the first vaccination's vaccine)
    const firstVaccination = completedVaccinations[0];
    const vaccine = vaccines.find(v => String(v.id) === String(firstVaccination.vaccineId));
    const requiredDoses = vaccine?.dosesRequired || 2;

    // Check if patient has completed the required number of doses
    if (completedVaccinations.length < requiredDoses) {
        return null;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Premium Design Background ---

    // Outer Border
    doc.setDrawColor(16, 185, 129); // Green border
    doc.setLineWidth(1.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Inner Border
    doc.setDrawColor(5, 150, 105); // Darker green
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Watermark (subtle)
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.text('VACCINATED', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });

    // HEADER
    doc.setFillColor(6, 95, 70); // Dark Green Header
    doc.rect(10, 10, pageWidth - 20, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.setFont('times', 'bold'); // More premium font
    doc.text('CERTIFICATE OF VACCINATION', pageWidth / 2, 35, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('COVID-19 Immunization Record', pageWidth / 2, 48, { align: 'center' });

    // Certificate Number
    const certNumber = `VAC-${String(patient.id).padStart(5, '0')}-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Certificate ID: ${certNumber}`, 160, 75, { align: 'right' });

    // PATIENT DETAILS
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    doc.text('BENEFICIARY DETAILS', 20, 85);
    doc.setDrawColor(6, 95, 70);
    doc.setLineWidth(0.5);
    doc.line(20, 88, 100, 88);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');

    const startY = 100;
    const lineHeight = 10;

    doc.text('Name:', 25, startY);
    doc.setFont('helvetica', 'bold');
    doc.text(patient.name, 60, startY);

    doc.setFont('helvetica', 'normal');
    doc.text('Gender / Age:', 25, startY + lineHeight);
    doc.setFont('helvetica', 'bold');
    doc.text(`${patient.gender || 'N/A'}`, 60, startY + lineHeight); // Removed DOB calc for simplicity

    doc.setFont('helvetica', 'normal');
    doc.text('Location:', 25, startY + lineHeight * 2);
    doc.setFont('helvetica', 'bold');
    doc.text(patient.city || 'N/A', 60, startY + lineHeight * 2);

    // VACCINATION DETAILS
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    doc.text('VACCINATION DETAILS', 20, 145);
    doc.line(20, 148, 100, 148);

    // Sort vaccinations
    const sortedVaccinations = completedVaccinations
        .sort((a, b) => a.doseNumber - b.doseNumber)
        .slice(0, requiredDoses);

    let vaxY = 160;

    sortedVaccinations.forEach((vax, index) => {
        const vac = vaccines.find(v => String(v.id) === String(vax.vaccineId));
        const hospName = vax.hospital?.name || 'Authorized Center';

        // Card background
        doc.setFillColor(245, 245, 245);
        doc.setDrawColor(200, 200, 200);
        doc.roundedRect(20, vaxY, 170, 30, 2, 2, 'FD');
        doc.setFillColor(6, 95, 70);
        doc.circle(30, vaxY + 15, 6, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(String(vax.doseNumber), 30, vaxY + 18, { align: 'center' });

        // Details
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(vac?.name || 'COVID-19 Vaccine', 42, vaxY + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${vax.vaccinationDate}`, 42, vaxY + 20);

        doc.text(`Administered by:`, 110, vaxY + 10);
        doc.setFont('helvetica', 'bold');
        doc.text(hospName, 110, vaxY + 20);

        vaxY += 35;
    });

    // Validated Stamp
    doc.setDrawColor(6, 95, 70);
    doc.setLineWidth(2);
    doc.circle(160, 230, 18);
    doc.setFontSize(8);
    doc.setTextColor(6, 95, 70);
    doc.setFont('helvetica', 'bold');
    doc.text('VERIFIED', 160, 230, { align: 'center', angle: 25 });
    doc.text('SYSTEM', 160, 235, { align: 'center', angle: 25 });

    // Footer
    const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer-generated certificate.', pageWidth / 2, 270, { align: 'center' });
    doc.text(`Issued on ${issueDate}`, pageWidth / 2, 275, { align: 'center' });

    if (action === 'download') {
        doc.save(`Certificate_${patient.name.replace(/\s+/g, '_')}.pdf`);
        return certNumber;
    } else {
        // Return blob URL for preview
        return doc.output('bloburl');
    }
};
