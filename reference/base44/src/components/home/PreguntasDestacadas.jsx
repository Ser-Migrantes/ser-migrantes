import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PreguntaAcordeon from '@/components/PreguntaAcordeon';
import Reveal from '@/components/Reveal';
import { RUTAS } from '@/lib/urls';

export default function PreguntasDestacadas({ preguntas, relatos }) {
  if (!preguntas?.length) return null;

  return (
    <section className="seccion">
      <div className="contenedor grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="etiqueta text-primario">Preguntas frecuentes</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-secundario md:text-[2.6rem]">
            Las dudas que más nos llegan.
          </h2>
          <p className="prosa-lectura mt-4 text-base leading-[1.7] text-texto-suave">
            Explicaciones cortas y en lenguaje claro sobre extranjería, empleo, vivienda y salud. Si
            tu pregunta no aparece, puedes escribirnos.
          </p>
          <Link
            to={RUTAS.preguntas}
            className="mt-6 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-all duration-200 hover:-translate-y-0.5 hover:bg-secundario"
          >
            Ver todas las preguntas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal delay={100} className="rounded-[1.75rem] border border-border/80 bg-superficie px-6 shadow-suave md:px-8">
          <PreguntaAcordeon preguntas={preguntas} relatos={relatos} />
        </Reveal>
      </div>
    </section>
  );
}