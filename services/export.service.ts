import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class ExportService {
  /**
   * Generates a CSV string and triggers download
   */
  static generateCSV(filename: string, headers: string[], rows: any[][]) {
    // Safely format CSV cells (escape quotes and commas)
    const formatCell = (cell: any) => {
      const cellStr = cell === null || cell === undefined ? '' : String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    };

    const csvContent = [
      headers.map(formatCell).join(','),
      ...rows.map(row => row.map(formatCell).join(','))
    ].join('\n');

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  /**
   * Generates a beautifully styled invoice-like PDF
   */
  static generatePDF(
    filename: string,
    title: string,
    subtitle: string,
    headers: string[],
    rows: any[][],
    summaryData?: Record<string, string>
  ) {
    const doc = new jsPDF();
    
    // Add Company Logo/Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Primary Color (Indigo 600)
    doc.text("AI STUDIO GLOBAL", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("123 Innovation Drive, Tech City, TC 90210", 14, 26);
    doc.text("support@aistudio.corp | www.aistudioglobal.com", 14, 31);
    
    // Add Document Title & Subtitle
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text(title, 14, 45);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, 14, 51);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 56);

    let startY = 65;

    // Add Summary Data if provided
    if (summaryData) {
      doc.setFillColor(248, 250, 252); // Slate 50
      doc.rect(14, startY, 182, 25, 'F');
      
      let xOffset = 20;
      Object.entries(summaryData).forEach(([key, value]) => {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(key.toUpperCase(), xOffset, startY + 8);
        
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.text(value, xOffset, startY + 16);
        doc.setFont("helvetica", "normal");
        
        xOffset += 45;
      });
      startY += 35;
    }

    // Add Table
    autoTable(doc, {
      startY: startY,
      head: [headers],
      body: rows,
      theme: 'striped',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    // Add Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }

    doc.save(`${filename}.pdf`);
  }
}
