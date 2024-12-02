import { useEffect, useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { Download, FileInput, FileText } from "lucide-react";

interface DashboardReportProps {
  role: string;
}

// Definimos la interfaz completa del Partner
interface Partner {
  partner_id: string;
  identity_card: string;
  reg_code: string;
  names: string;
  last_names: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  education_level: string;
  occupation: string;
  marital_status: string;
  children: [];
  status: string;
  created_at: string;
}

export function DashboardReport({ role }: DashboardReportProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Estado para la URL del preview

  const fetchData = useCallback(async () => {
    if (role === 'admin') {
      const reportPartners = await fetch('/api/partners');
      const json = await reportPartners.json();
      setPartners(json);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Función para formatear la fecha (Inscripción)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const generatePDFPartners = () => {
    const doc = new jsPDF();
    let yPosition = 40;
    const marginLeft = 20;
    const colWidth = 50;
    const colWidth2 = 120;
    const colWidth3 = 30;
    const colWidth4 = 40;

    // Título del reporte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("APAFA145 - Reporte de Asociados", 20, 20);

    // Descripción del reporte
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Este documento es un reporte generado dinámicamente.", 20, 26);

    // Encabezados de las columnas
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Asociado", marginLeft, yPosition);
    doc.text("Contacto", marginLeft + colWidth, yPosition);
    doc.text("Hijos", marginLeft + colWidth2, yPosition);
    doc.text("Inscripción", marginLeft + colWidth2 + colWidth3, yPosition);

    yPosition += 6;

    // Iterar sobre los socios y agregar cada uno al PDF
    partners.forEach((partner) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(partner.reg_code, marginLeft, yPosition);
      doc.text(`${partner.names} ${partner.last_names}`, marginLeft, yPosition + 6);
      doc.text(partner.email, marginLeft + colWidth, yPosition);
      doc.text(partner.address, marginLeft + colWidth, yPosition + 6);
      doc.text(partner.identity_card, marginLeft + colWidth, yPosition + 12);
      doc.text(`${partner.children.length}`, marginLeft + colWidth2, yPosition);
      doc.text(formatDate(partner.created_at), marginLeft + colWidth2 + colWidth3, yPosition);

      yPosition += 18; // Espacio adicional para separar la siguiente fila

      if (yPosition > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPosition = 40;
      }
    });

    // Generar un Blob en lugar de guardar directamente
    const pdfBlob = doc.output("blob");
    const previewUrl = URL.createObjectURL(pdfBlob);
    setPreviewUrl(previewUrl); // Actualizamos la URL para el preview
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    // Repetir la misma lógica de generación del PDF aquí para descargarlo
    // Se puede reutilizar la función generatePDFPartners pero llamando doc.save()
    doc.save("reporte_socios.pdf");
  };

  return (
    <div className="mt-10 px-6">
      {role === 'admin' && (
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Reportes</CardTitle>
            <CardDescription>Solicitudes recientes de socios.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="">
              <Button variant="outline" onClick={generatePDFPartners}>
                <FileText className="mr-1" /> Generar reporte de asociados
              </Button>

              {/* Mostrar el preview si existe */}
              {previewUrl && (
                <div className="mt-4">
                  <iframe
                    src={previewUrl}
                    width="100%"
                    height="500px"
                    title="Preview PDF"
                  ></iframe>
                  <Button variant="outline" onClick={downloadPDF} className="mt-4">
                    Descargar PDF
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
