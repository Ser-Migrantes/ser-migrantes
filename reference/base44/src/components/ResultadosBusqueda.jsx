import { Link } from 'react-router-dom';
import { ArrowUpRight, MessageCircleQuestion } from 'lucide-react';
import PreguntaAcordeon from './PreguntaAcordeon';
import { RUTAS, rutaRelato } from '@/lib/urls';

export default function ResultadosBusqueda({ relatos, preguntas, onLimpiar }) {
  const total = (relatos?.length || 0) + (preguntas?.length || 0);

  return (
    <div className="mt-7 border-t border-border pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-texto-suave">
          <span className="font-semibold text-secundario">{relatos?.length || 0}</span>{' '}
          {relatos?.length === 1 ? 'historia' : 'historias'} y{' '}
          <span className="font-semibold text-secundario">{preguntas?.length || 0}</span>{' '}
          {preguntas?.length === 1 ? 'pregunta relacionada' : 'preguntas relacionadas'}
        </p>
        <button
          type="button"
          onClick={onLimpiar}
          className="min-h-[44px] text-sm font-medium text-primario underline decoration-acento decoration-2 underline-offset-4 hover:text-secundario"
        >
          Limpiar búsqueda
        </button>
      </div>

      {total === 0 ? (
        <div className="mt-5 rounded-[1.5rem] border border-border bg-superficie-suave p-6">
          <div className="flex items-start gap-3">
            <MessageCircleQuestion className="mt-0.5 h-5 w-5 shrink-0 text-primario" aria-hidden="true" />
            <div>
              <p className="font-heading text-lg text-secundario">
                Todavía no tenemos un caso igual al tuyo
              </p>
              <p className="mt-2 text-sm leading-[1.7] text-texto-suave">
                Cuéntanos tu situación y te orientamos hacia el servicio o la información que más te
                sirva. No estás sola ni solo en esto.
              </p>
              <Link
                to={RUTAS.contacto}
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-colors hover:bg-secundario"
              >
                Cuéntanos tu caso
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-8 lg:grid-cols-2">
          {relatos?.length > 0 && (
            <div>
              <p className="etiqueta text-primario">Historias</p>
              <ul className="mt-3 space-y-2">
                {relatos.slice(0, 3).map((relato) => (
                  <li key={relato.id}>
                    <Link
                      to={rutaRelato(relato)}
                      className="group flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-fondo px-4 py-3 transition-colors duration-200 hover:border-acento hover:bg-acento/25"
                    >
                      <span>
                        <span className="block font-heading text-base leading-snug text-texto">
                          {relato.titulo}
                        </span>
                        <span className="mt-0.5 block text-xs text-texto-suave">{relato.casuistica}</span>
                      </span>
                      <ArrowUpRight
                        className="mt-1 h-4 w-4 shrink-0 text-primario transition-transform group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              {relatos.length > 3 && (
                <Link
                  to={RUTAS.historias}
                  className="mt-3 inline-flex text-sm font-medium text-primario underline decoration-acento decoration-2 underline-offset-4"
                >
                  Ver las {relatos.length} historias
                </Link>
              )}
            </div>
          )}

          {preguntas?.length > 0 && (
            <div>
              <p className="etiqueta text-primario">Preguntas</p>
              <PreguntaAcordeon preguntas={preguntas.slice(0, 4)} />
              {preguntas.length > 4 && (
                <Link
                  to={RUTAS.preguntas}
                  className="mt-2 inline-flex text-sm font-medium text-primario underline decoration-acento decoration-2 underline-offset-4"
                >
                  Ver más preguntas
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}