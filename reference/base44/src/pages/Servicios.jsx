import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import useContenidoPublico from '@/hooks/useContenidoPublico';
import Breadcrumbs from '@/components/Breadcrumbs';
import Boton from '@/components/Boton';
import Reveal from '@/components/Reveal';
import { registrarEvento } from '@/lib/eventos';
import { usePageMeta } from '@/lib/seo';
import { RUTAS } from '@/lib/urls';

const ETIQUETA_TIPO = {
  propio: 'Servicio propio',
  aliado: 'Aliado de confianza',
  colaborador: 'Colaborador',
};

export default function Servicios() {
  usePageMeta({
    titulo: 'Servicios para personas migrantes | Ser Migrantes',
    descripcion:
      'Acogida, gestión documental, orientación laboral y acompañamiento con intérprete. Servicios propios y de aliados de confianza en España.',
    ruta: RUTAS.servicios,
  });

  const { servicios, cargando } = useContenidoPublico();

  return (
    <>
      <section className="contenedor pb-2 pt-8">
        <Breadcrumbs items={[{ label: 'Inicio', to: RUTAS.inicio }, { label: 'Servicios' }]} />
      </section>

      <section className="contenedor pb-10 pt-6 md:pt-10">
        <Reveal className="max-w-3xl">
          <p className="etiqueta text-primario">Servicios</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.06] text-secundario md:text-[3.2rem]">
            Acompañamiento real, no un listado de enlaces
          </h1>
          <p className="prosa-lectura mt-4 text-lg leading-[1.7] text-texto-suave">
            Trabajamos con servicios propios y con aliados de confianza. Te explicamos qué resuelve
            cada uno y qué necesitas antes de decidir nada.
          </p>
        </Reveal>
      </section>

      <section className="contenedor pb-16 md:pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {servicios.map((servicio, indice) => (
            <Reveal
              key={servicio.id}
              as="article"
              delay={Math.min(indice, 4) * 70}
              className="flex h-full flex-col rounded-[1.75rem] border border-border/80 bg-superficie p-7 shadow-suave transition-all duration-300 hover:-translate-y-1 hover:shadow-elevada md:p-8"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-acento/45 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-texto">
                  {ETIQUETA_TIPO[servicio.tipo] || servicio.tipo}
                </span>
                {servicio.proveedor && (
                  <span className="text-xs text-texto-suave">con {servicio.proveedor}</span>
                )}
              </div>

              <h2 className="mt-4 font-heading text-2xl font-semibold text-secundario">
                {servicio.nombre}
              </h2>
              <p className="mt-2 flex-1 text-[1rem] leading-[1.7] text-texto-suave">
                {servicio.descripcion}
              </p>

              {servicio.url_destino ? (
                <a
                  href={servicio.url_destino}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    registrarEvento({ tipo: 'clic_servicio', referencia: servicio.nombre })
                  }
                  className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-1.5 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-colors duration-200 hover:bg-secundario"
                >
                  Ir al servicio
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to={`${RUTAS.contacto}?servicio=${encodeURIComponent(servicio.nombre)}`}
                  onClick={() =>
                    registrarEvento({ tipo: 'clic_servicio', referencia: servicio.nombre })
                  }
                  className="mt-6 inline-flex min-h-[44px] w-fit items-center gap-1.5 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-colors duration-200 hover:bg-secundario"
                >
                  Solicitar información
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </Reveal>
          ))}
        </div>

        {!cargando && servicios.length === 0 && (
          <p className="rounded-[1.5rem] border border-border bg-superficie-suave p-6 text-sm text-texto-suave">
            Estamos actualizando el catálogo de servicios. Si necesitas orientación, escríbenos.
          </p>
        )}

        <Reveal className="mt-12 rounded-[2rem] bg-secundario p-7 text-crema md:p-12">
          <h2 className="font-heading text-2xl font-semibold text-crema md:text-3xl">
            ¿No sabes qué servicio necesitas?
          </h2>
          <p className="prosa-lectura mt-3 text-[1.02rem] leading-[1.7] text-crema/85">
            Cuéntanos tu situación y te orientamos hacia el servicio o la información que más te
            sirva. Sin compromiso y sin tecnicismos.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Boton to={RUTAS.contacto} variante="claro">
              Cuéntanos tu caso
            </Boton>
            <Boton to={RUTAS.preguntas} variante="contornoClaro">
              Ver preguntas frecuentes
            </Boton>
          </div>
        </Reveal>

        <p className="mt-8 flex max-w-2xl items-start gap-2 text-xs leading-relaxed text-texto-suave">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primario" aria-hidden="true" />
          Ser Migrantes ofrece información general y orientación inicial. No presta asesoramiento
          jurídico ni sustituye a un profesional.
        </p>
      </section>
    </>
  );
}