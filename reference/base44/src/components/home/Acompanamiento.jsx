import { BookOpen, HelpCircle, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import { RUTAS } from '@/lib/urls';

const PASOS = [
  {
    icono: BookOpen,
    titulo: 'Identifícate con otras historias',
    texto:
      'Lee casos reales adaptados de personas que vivieron algo parecido a lo tuyo. Saber que no estás sola o solo también ayuda.',
    enlace: { label: 'Ver historias de migrantes', to: RUTAS.historias },
  },
  {
    icono: HelpCircle,
    titulo: 'Resuelve tus dudas',
    texto:
      'Respuestas breves sobre documentación, NIE, arraigo, empleo o vivienda, explicadas sin jerga administrativa.',
    enlace: { label: 'Consultar preguntas frecuentes', to: RUTAS.preguntas },
  },
  {
    icono: Compass,
    titulo: 'Da el siguiente paso con ayuda adecuada',
    texto:
      'Cuando toca actuar, te orientamos hacia el servicio o el profesional que corresponde, sin promesas que no se puedan cumplir.',
    enlace: { label: 'Conocer los servicios', to: RUTAS.servicios },
  },
];

export default function Acompanamiento() {
  return (
    <section className="seccion">
      <div className="contenedor">
        <Reveal className="max-w-2xl">
          <p className="etiqueta text-primario">Cómo te acompañamos</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-secundario md:text-[2.6rem]">
            Tres formas de sentirte acompañado.
          </h2>
          <p className="mt-4 text-base leading-[1.7] text-texto-suave md:text-[1.05rem]">
            Sin trámites imposibles ni letra pequeña: empezamos por lo que necesitas entender hoy.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PASOS.map((paso, indice) => (
            <Reveal
              key={paso.titulo}
              as="article"
              delay={indice * 90}
              className="group flex h-full flex-col rounded-[1.75rem] border border-border/80 bg-superficie p-7 shadow-suave transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevada"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-superficie-suave text-primario transition-colors duration-300 group-hover:bg-acento group-hover:text-texto">
                <paso.icono className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-secundario">
                {paso.titulo}
              </h3>
              <p className="mt-3 flex-1 text-[0.98rem] leading-[1.7] text-texto-suave">
                {paso.texto}
              </p>
              <Link
                to={paso.enlace.to}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primario underline-offset-4 hover:underline"
              >
                {paso.enlace.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}