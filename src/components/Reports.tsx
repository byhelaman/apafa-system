import { useEffect, useState, useCallback } from "react"
import { jsPDF } from "jspdf"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "./ui/button"
import { Download } from "lucide-react"

interface DashboardReportProps {
  role: string
}

// Definimos la interfaz completa del Partner
interface Partner {
  partner_id: string
  identity_card: string
  reg_code: string
  names: string
  last_names: string
  dob: string
  phone: string
  email: string
  address: string
  education_level: string
  occupation: string
  marital_status: string
  children: [] // El campo children es un array que solo cuenta los valores dentro
  status: string
  created_at: string // Fecha de inscripción
}

export function DashboardReport({ role }: DashboardReportProps) {
  const [partners, setPartners] = useState<Partner[]>([])

  const fetchData = useCallback(async () => {
    if (role === 'admin') {
      const reportPartners = await fetch('/api/partners')
      const json = await reportPartners.json()
      setPartners(json)
    }
  }, [role])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Función para formatear la fecha (Inscripción)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }

  // Función para generar el PDF
  const generatePDF = () => {
    const doc = new jsPDF()

    // Título del reporte
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("APAFA145 - Reporte de Asociados", 20, 20)

    // Descripción del reporte
    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.text("Este documento es un reporte generado dinámicamente.", 20, 26)

    // Establecer la posición inicial para los datos
    let yPosition = 40
    const marginLeft = 20
    const colWidth = 50 // Ajustado el ancho de la columna
    const colWidth2 = 120 // Ancho para la columna de "Contacto"
    const colWidth3 = 30 // Ancho para la columna de "Hijos"
    const colWidth4 = 40 // Ancho para la columna de "Inscripción"

    // Encabezados de las columnas
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.text("Asociado", marginLeft, yPosition)
    doc.text("Contacto", marginLeft + colWidth, yPosition)
    doc.text("Hijos", marginLeft + colWidth2, yPosition)
    doc.text("Inscripción", marginLeft + colWidth2 + colWidth3, yPosition)

    // Ajustar la posición para los datos de la primera fila
    yPosition += 6

    // Iterar sobre los socios y agregar cada uno al PDF con el formato en 4 columnas
    partners.forEach((partner) => {
      doc.setFont("helvetica", "normal")
      // Columna 1: Asociado
      doc.setFontSize(10)
      doc.text(partner.reg_code, marginLeft, yPosition)
      doc.text(`${partner.names} ${partner.last_names}`, marginLeft, yPosition + 6)

      // Columna 2: Contacto
      doc.text(partner.email, marginLeft + colWidth, yPosition)
      doc.text(partner.address, marginLeft + colWidth, yPosition + 6)
      doc.text(partner.identity_card, marginLeft + colWidth, yPosition + 12)

      // Columna 3: Hijos
      doc.text(`${partner.children.length}`, marginLeft + colWidth2, yPosition)

      // Columna 4: Inscripción (formatear fecha)
      doc.text(formatDate(partner.created_at), marginLeft + colWidth2 + colWidth3, yPosition)

      // Ajustamos la posición para la siguiente fila
      yPosition += 18 // Espacio adicional para separar de la siguiente entrada

      // Verificar si se ha llegado al final de la página
      if (yPosition > doc.internal.pageSize.height - 40) {
        doc.addPage() // Si llegamos al final, agregamos una nueva página
        yPosition = 40 // Restablecer la posición vertical
      }
    })

    // Guardamos el archivo PDF
    doc.save("reporte_socios.pdf")
  }

  return (
    <div className="mt-10 px-6">
      {role === 'admin' && (
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Reportes</CardTitle>
            <CardDescription>Solicitudes recientes de socios.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={generatePDF}> <Download className="mr-1" /> Generar reporte de asociados</Button>
              <Button variant="outline"><Download className="mr-1" />Generar reporte de estudiantes</Button>
              <Button variant="outline"><Download className="mr-1" />Generar reporte de actividades</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
