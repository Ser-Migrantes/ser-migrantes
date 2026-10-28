import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import useContenidoPublico from '@/hooks/useContenidoPublico';
import PreguntaAcordeon from '@/components/PreguntaAcordeon';
import RelatoCard from '@/components/RelatoCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import Boton from '@/components/Boton';
import Reveal from '@/components/Reveal';
import { registrarEvento } from '@/lib/eventos';
import { IMAGEN_DEFECTO, SITIO, recortar, useMeta404, usePageMeta } from '@/lib/seo';
import { RUTAS, coincideRelato, rutaRelato, slugDeRelato } from '@/lib/urls';

function formatearFecha(fecha) {
  if (!fecha) return null;
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return null;
  return valor.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function RelatoDetalle() {
  const { slug } = useParams();
  const { relatos, preguntas, servicios, cargando } = useContenidoPublico();

  const relato = useMemo(() => relatos.find((item) => coincideRelato(item, slug)), [relatos, slug]);

  const preguntasAsociadas = useMemo(() => {
    if (!relato) return [];
    const clave = slugDeRelato(relato);
    return preguntas.filter((pregunta) => (pregunta.microrelatos_asociados || []).includes(clave));
  }, [preguntas, relato]);

  const servicio = useMemo(() => {
    if (!relato?.servicio_relacionado) return null;
    return servicios.find((item) => item.nombre === relato.servicio_relacionado) || null;
  }, [servicios, relato]);

  const relacionados = useMemo(() => {
    if (!relato) return [];
    return relatos
      .filter((item) => item.id !== relato.id && item.casuistica === relato.casuistica)
      .slice(0, 3);
  }, [relatos, relato]);

  const fecha = formatearFecha(relato?.fecha_publicacion);

  const jsonLd = useMemo(() => {
    if (!relato) return null;
    const url = `${SITIO}${rutaRelato(relato)}`;
    const articulo = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: relato.titulo,
      description: relato.resumen,
      inLanguage: 'es-ES',
      mainEntityOfPage: url,
      articleSection: relato.casuistica,
      keywords: (relato.etiquetas || []).join(', '),
      image: IMAGEN_DEFECTO,
      ...(relato.fecha_publicacion ? { datePublished: relato.fecha_publicacion } : {}),
      author: { '@type': 'Organization', name: 'Ser Migrantes', url: SITIO },
      publisher: { '@type': 'Organization', name: 'Ser Migrantes', url: SITIO },
    };

    const faq =
      preguntasAsociadas.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            inLanguage: 'es-ES',
            mainEntity: preguntasAsociadas.map((pregunta) => ({
              '@type': 'Question',
              name: pregunta.pregunta,
              acceptedAnswer: { '@type': 'Answer', text: pregunta.respuesta },
            })),
          }
        : null;

    return [articulo, faq].filter(Boolean);
  }, [relato, preguntasAsociadas]);

  usePageMeta({
    titulo: relato
      ? `${recortar(relato.titulo, 44)} | Ser Migrantes`
      : 'Historia no encontrada | Ser Migrantes',
    descripcion: relato?.resumen || 'Esta historia no está disponible o ha cambiado de dirección.',
    ruta: relato ? rutaRelato(relato) : RUTAS.historias,
    jsonLd: jsonLd || undefined,
    noindex: !relato,
  });
  useMeta404(!cargando && !relato);

  useEffect(() => {
    if (relato) registrarEvento({ tipo: 'clic_relato', referencia: slugDeRelato(relato) });
  }, [relato]);

  if (cargando) {
    return (
      <section className="contenedor py-20">
        <p className="text-sm text-texto-suave" role="status">
          Cargando la historia…
        </p>
      </section>
    );
  }

  if (!relato) {
    return (
      <section className="contenedor py-20">
        <p className="etiqueta text-primario">Historia no disponible</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-secundario md:text-4xl">
          No encontramos esta historia
        </h1>
        <p className="mt-3 max-w-lg text-[1.02rem] leading-[1.7] text-texto-suave">
          Puede que se haya retirado o que el enlace esté mal escrito. Puedes ver todas las historias
          publicadas o buscar por tu situación.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Boton to={RUTAS.historias}>
            Ver todas las historias
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Boton>
          <Boton to={RUTAS.contacto} variante="secundario">
            Cuéntanos tu caso
          </Boton>
        </div>
      </section>
    );
  }

  const parrafos = (relato.contenido || '').split('\n\n').filter(Boolean);

  return (
    <>
      <div className="contenedor pb-2 pt-8">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: RUTAS.inicio },
            { label: 'Historias', to: RUTAS.historias },
            { label: relato.titulo },
          ]}
        />
      </div>

      <section className="contenedor grid gap-10 pb-14 pt-6 md:grid-cols-[1.4fr_0.6fr] md:gap-14 md:pt-10">
        <article>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primario px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-crema">
              {relato.casuistica}
            </span>
            {relato.perfil && (
              <span className="rounded-full border border-secundario/25 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-secundario">
                {relato.perfil}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-3xl font-heading text-[2.1rem] font-semibold leading-[1.08] text-secundario md:text-[2.9rem]">
            {relato.titulo}
          </h1>

          <p className="prosa-lectura mt-4 font-heading text-lg leading-snug text-texto-suave md:text-xl">
            {relato.resumen}
          </p>

          {fecha && (
            <p className="mt-5 inline-flex items-center gap-1.5 text-sm text-texto-suave">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Publicado el {fecha}
            </p>
          )}

          <div className="prosa-lectura mt-8 text-[1.08rem] leading-[1.75] text-texto">
            {parrafos.map((parrafo, indice) => (
              <p key={indice} className="mt-5 first:mt-0">
                {parrafo}
              </p>
            ))}
          </div>

          {relato.etiquetas?.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {relato.etiquetas.map((etiqueta) => (
                <li
                  key={etiqueta}
                  className="rounded-full bg-superficie-suave px-3 py-1 text-xs font-medium text-secundario"
                >
                  {etiqueta}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 max-w-2xl border-t border-border pt-5">
            <p className="text-xs leading-relaxed text-texto-suave">
              Este relato es un caso real reescrito y adaptado para proteger la identidad de su
              protagonista. No es una transcripción literal.
            </p>
            <p className="mt-2 text-xs font-medium leading-relaxed text-texto-suave">
              Esta información es orientativa y no sustituye el asesoramiento de un profesional.
            </p>
          </div>
        </article>

        <aside className="space-y-5 md:sticky md:top-24 md:self-start">
          <div className="rounded-[1.75rem] bg-acento p-6">
            <h2 className="font-heading text-xl font-semibold text-texto">
              ¿Estás en una situación parecida?
            </h2>
            <p className="mt-2 text-sm leading-[1.7] text-texto/80">
              Escríbenos y te orientamos con calma hacia el siguiente paso.
            </p>
            <Link
              to={`${RUTAS.contacto}?relato=${encodeURIComponent(slugDeRelato(relato))}`}
              className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-all duration-200 hover:-translate-y-0.5 hover:bg-secundario"
            >
              {relato.cta_principal || 'Cuéntanos tu caso'}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {servicio && (
            <div className="rounded-[1.75rem] border border-border/80 bg-superficie p-6 shadow-suave">
              <p className="etiqueta text-primario">Servicio relacionado</p>
              <h2 className="mt-2 font-heading text-lg font-semibold text-secundario">
                {servicio.nombre}
              </h2>
              <p className="mt-2 text-sm leading-[1.7] text-texto-suave">{servicio.descripcion}</p>
              <Link
                to={`${RUTAS.contacto}?servicio=${encodeURIComponent(servicio.nombre)}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primario underline-offset-4 hover:underline"
              >
                Solicitar información
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="rounded-[1.75rem] border border-border/80 bg-superficie-suave p-6">
            <p className="etiqueta text-primario">Antes de actuar</p>
            <p className="mt-2 text-sm leading-[1.7] text-texto-suave">
              Los requisitos cambian. Contrasta siempre tu caso con la administración competente o
              con un profesional de extranjería.
            </p>
          </div>
        </aside>
      </section>

      {preguntasAsociadas.length > 0 && (
        <section className="bg-superficie-suave py-14 md:py-20">
          <div className="contenedor">
            <Reveal className="max-w-3xl">
              <p className="etiqueta text-primario">Preguntas sobre este caso</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-secundario md:text-[2rem]">
                Lo que más se pregunta en esta situación
              </h2>
              <div className="mt-5 rounded-[1.75rem] border border-border/80 bg-superficie px-6 md:px-8">
                <PreguntaAcordeon preguntas={preguntasAsociadas} relatos={relatos} />
              </div>
              <Link
                to={RUTAS.preguntas}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primario underline-offset-4 hover:underline"
              >
                Ver todas las preguntas frecuentes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {relacionados.length > 0 && (
        <section className="seccion">
          <div className="contenedor">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-heading text-2xl font-semibold text-secundario md:text-[2rem]">
                Otras historias sobre {relato.casuistica.toLowerCase()}
              </h2>
              <Link
                to={RUTAS.historias}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primario underline-offset-4 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Todas las historias
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relacionados.map((item, indice) => (
                <Reveal key={item.id} delay={indice * 70} className="h-full">
                  <RelatoCard relato={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}