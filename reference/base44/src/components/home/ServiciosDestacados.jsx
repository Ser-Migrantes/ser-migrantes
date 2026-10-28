import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Reveal from '@/components/Reveal';
import { registrarEvento } from '@/lib/eventos';
import { RUTAS } from '@/lib/urls';

const ETIQUETA_TIPO = {
  propio: 'Servicio propio',
  aliado: 'Aliado de confianza',
  colaborador: 'Colaborador',
};

export default function ServiciosDestacados({ servicios }) {
  if (!servicios?.length) return null;

  return (
    <section className="seccion bg-superficie-suave">
      <div className="contenedor">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="etiqueta text-primario">Servicios</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-secundario md:text-[2.6rem]">
              Ayuda concreta para tu siguiente paso.
            </h2>
            <p className="mt-4 text-base leading-[1.7] text-texto-suave md:text-[1.05rem]">
              Servicios propios y de aliados de confianza. Te contamos qué resuelve cada uno antes de
              que decidas nada.
            </p>
          </div>
          <Link
            to={RUTAS.servicios}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-secundario/25 px-5 text-sm font-medium text-secundario transition-colors hover:border-secundario hover:bg-superficie"
          >
            Ver todos los servicios
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {servicios.map((servicio, indice) => (
            <Reveal
              key={servicio.id}
              as="article"
              delay={indice * 80}
              className="flex h-full flex-col rounded-[1.75rem] border border-border/80 bg-superficie p-7 shadow-suave transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elevada"
            >
              <span className="inline-flex w-fit rounded-full bg-acento/45 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-texto">
                {ETIQUETA_TIPO[servicio.tipo] || servicio.tipo}
              </span>
              <h3 className="mt-4 font-heading text-xl font-semibold text-secundario">
                {servicio.nombre}
              </h3>
              <p className="mt-2 flex-1 text-[0.96rem] leading-[1.7] text-texto-suave">
                {servicio.descripcion}
              </p>

              {servicio.url_destino ? (
                <a
                  href={servicio.url_destino}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => registrarEvento({ tipo: 'clic_servicio', referencia: servicio.nombre })}
                  className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-1.5 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-colors duration-200 hover:bg-secundario"
                >
                  Ir al servicio
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to={`${RUTAS.contacto}?servicio=${encodeURIComponent(servicio.nombre)}`}
                  onClick={() => registrarEvento({ tipo: 'clic_servicio', referencia: servicio.nombre })}
                  className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-1.5 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-colors duration-200 hover:bg-secundario"
                >
                  Solicitar información
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}