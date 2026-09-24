import jsPDF from 'jspdf';
import { JobCardData, Language } from '../types';

export interface PDFReportData {
  uid: string;
  phone: string;
  language: Language;
  education: string;
  currentWork: string;
  selectedJobs: JobCardData[];
}

export function generateSimplePDF(data: PDFReportData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm

  // Background banner header (Govt Green / Blue Theme)
  doc.setFillColor(20, 83, 45); // Deep emerald green
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Title Header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('JEEVANPATH - LIVELIHOOD REPORT', pageWidth / 2, 16, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SC Beneficiary Skill & Livelihood Empowerment Initiative', pageWidth / 2, 24, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} | Toll-Free Helpline: 1800-425-2424`, pageWidth / 2, 31, { align: 'center' });

  // Reset text color for body
  doc.setTextColor(30, 41, 59);

  // Section 1: Beneficiary Profile Card
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, 44, pageWidth - 28, 30, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('BENEFICIARY DETAILS', 20, 52);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Beneficiary ID: ${data.uid}`, 20, 60);
  doc.text(`Registered Phone: ${data.phone || 'Not Provided (Recorded via App)'}`, 20, 67);

  doc.text(`Education Level: ${data.education || 'Basic / Middle School'}`, 115, 60);
  doc.text(`Current Work: ${data.currentWork || 'Informal / Agricultural Labor'}`, 115, 67);

  // Section 2: Selected Livelihood Trades
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 83, 45);
  doc.text('SELECTED LIVELIHOOD TRADES (RECOMMENDED)', 14, 82);

  let currentY = 88;

  if (data.selectedJobs.length === 0) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('No specific jobs were selected. Please contact the nearest training centre below.', 14, currentY);
    currentY += 15;
  } else {
    data.selectedJobs.forEach((job, index) => {
      // Job Card Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, currentY, pageWidth - 28, 28, 2, 2, 'FD');

      // Left Accent bar
      doc.setFillColor(16, 185, 129); // Emerald accent
      doc.rect(14, currentY, 4, 28, 'F');

      // Job Title & Badge
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${index + 1}. ${job.title_en} (${job.title})`, 22, currentY + 8);

      // NSQF Badge
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text(`NSQF Level: ${job.nsqf_level}  |  Match Score: ${job.match_score}%`, 22, currentY + 15);

      // Wage & Duration
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`Est. Daily Earnings: ${job.wage_estimate}  |  Training Duration: ${job.training_duration}`, 22, currentY + 22);

      currentY += 32;
    });
  }

  // Section 3: Nearest Training Centre & Admission
  const primaryCentre = data.selectedJobs[0]?.nearest_centre || {
    name: 'District Skill Development & Training Centre (PMKK)',
    address: 'District Collectorate Complex, Near Industrial Area',
    contact_person: 'Shri K. Rajesh (Training Coordinator)',
    phone: '98401 23456',
    helpline: '1800-425-2424',
    stipend_info: 'Free training + Free Tool Kit + Daily Stipend',
  };

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 83, 45);
  doc.text('NEAREST TRAINING CENTRE & CONTACT', 14, currentY + 4);

  currentY += 9;

  doc.setFillColor(254, 243, 199); // Soft Amber badge
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(14, currentY, pageWidth - 28, 48, 3, 3, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14);
  doc.text(primaryCentre.name, 20, currentY + 8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Address: ${primaryCentre.address}`, 20, currentY + 16);
  doc.text(`Contact Person: ${primaryCentre.contact_person}`, 20, currentY + 23);
  doc.text(`Direct Mobile: ${primaryCentre.phone}`, 20, currentY + 30);
  doc.text(`Toll-Free Helpline: ${primaryCentre.helpline}`, 115, currentY + 30);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 83, 45);
  doc.text(`Scheme Benefits: ${primaryCentre.stipend_info}`, 20, currentY + 38);

  currentY += 56;

  // Section 4: Free Government Benefits & Next Steps
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, currentY, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('BENEFITS ENTITLEMENT (GOVERNMENT SC SCHEME):', 20, currentY + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52);
  doc.text('1. 100% Free Government Certification (National Skill Qualification Framework).', 20, currentY + 13);
  doc.text('2. Free Toolkit & Equipment Box provided on course completion.', 20, currentY + 18);
  doc.text('3. Direct Bank Transfer (DBT) stipend for travel and food.', 20, currentY + 23);

  // Bottom Footer
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 280, pageWidth - 14, 280);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('JeevanPath Digital Livelihood Initiative | Dedicated to SC Community Socio-Economic Elevation', pageWidth / 2, 285, { align: 'center' });

  return doc;
}
