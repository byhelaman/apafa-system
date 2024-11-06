import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Apoyo Académico</AccordionTrigger>
        <AccordionContent>
          Organizamos programas de tutoría, talleres de refuerzo y gestionamos recursos educativos para mejorar el rendimiento académico de nuestros estudiantes.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Participación Familiar</AccordionTrigger>
        <AccordionContent>
          Fomentamos la participación activa de las familias a través de eventos comunitarios, talleres para padres y oportunidades de voluntariado en la escuela.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Eventos y Actividades</AccordionTrigger>
        <AccordionContent>
          Organizamos ferias de ciencias, festivales culturales, competencias deportivas y otras actividades extracurriculares para enriquecer la experiencia educativa.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Mejoras en Infraestructura</AccordionTrigger>
        <AccordionContent>
          Trabajamos en proyectos para mejorar las instalaciones escolares, como la renovación de bibliotecas, actualización de equipos tecnológicos y mantenimiento de áreas recreativas.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>Reconocimiento y Motivación</AccordionTrigger>
        <AccordionContent>
          Implementamos programas de reconocimiento para estudiantes, docentes y personal administrativo, celebrando sus logros y fomentando la excelencia en nuestra comunidad educativa.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
