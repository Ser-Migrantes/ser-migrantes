import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { slugDeRelato } from '@/lib/urls';

export default function PreguntaAcordeon({ preguntas, relatos = [] }) {
  if (!preguntas?.length) return null;

  const relatosPorSlug = new Map(relatos.map((relato) => [slugDeRelato(relato), relato]));

  return (
    <Accordion type="single" collapsible className="w-full">
      {preguntas.map((pregunta) => {
        const asociados = (pregunta.microrelatos_asociados || [])
          .map((slug) => relatosPorSlug.get(slug))
          .filter(Boolean);

        return (
          <AccordionItem
            key={pregunta.id}
            value={String(pregunta.id)}
            className="border-b border-border last:border-0"
          >
            <AccordionTrigger className="py-5 text-left font-heading text-[1.05rem] font-semibold text-secundario hover:no-underline md:text-lg">
              {pregunta.pregunta}
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <p className="prosa-lectura text-[0.97rem] leading-[1.7] text-texto-suave">
                {pregunta.respuesta}
              </p>

              {pregunta.casuistica && (
                <span className="mt-4 inline-block rounded-full bg-acento/45 px-3 py-1 text-xs font-medium text-texto">
                  {pregunta.casuistica}
                </span>
              )}

              {asociados.length > 0 && (
                <div className="mt-4 border-t border-border/70 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-texto-suave">
                    Historias relacionadas
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {asociados.map((relato) => (
                      <li key={relato.id}>
                        <Link
                          to={`/historias/${slugDeRelato(relato)}`}
                          className="inline-flex items-start gap-1.5 text-sm font-medium text-primario underline-offset-4 hover:underline"
                        >
                          {relato.titulo}
                          <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}