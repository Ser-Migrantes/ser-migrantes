import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useContenidoPublico from '@/hooks/useContenidoPublico';
import FiltroCasuistica from '@/components/FiltroCasuistica';
import PreguntaAcordeon from '@/components/PreguntaAcordeon';
import Reveal from '@/components/Reveal';
import { filtrarPreguntas } from '@/lib/busqueda';
import { usePageMeta } from '@/lib/seo';
import { RUTAS } from '@/lib/urls';

export default function Preguntas() {
  const { preguntas, relatos, cargando } = useContenidoPublico();
  const [q, setQ] = useState('');
  const [casuistica, setCasuistica] = useState('');

  const filtradas = useMemo(
    () => filtrarPreguntas(preguntas, { q, casuistica }),
    [preguntas, q, casuistica],
  );

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: 'es-ES',
      mainEntity: preguntas.slice(0, 20).map((pregunta) => ({
        '@type': 'Question',
        name: pregunta.pregunta,
        acceptedAnswer: { '@type': 'Answer', text: pregunta.respuesta },
      })),
    }),
    [preguntas],
  );

  usePageMeta({
    titulo: 'Preguntas frecuentes de extranjería | Ser Migrantes',
    descripcion:
      'Respuestas claras sobre NIE, empadronamiento, arraigo, empleo, vivienda y salud para personas migrantes en España. Busca tu duda por situación.',
    ruta: RUTAS.preguntas,
    jsonLd: preguntas.length > 0 ? jsonLd : null,
  });

  return (
    <>
      <section className="contenedor pb-8 pt-10 md:pt-16">
        <Reveal className="max-w-3xl">
          <p className="etiqueta text-primario">Preguntas frecuentes</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.06] text-secundario md:text-[3.2rem]">
            Dudas concretas, respuestas claras
          </h1>
          <p className="prosa-lectura mt-4 text-lg leading-[1.7] text-texto-suave">
            Sin jerga administrativa y sin rodeos. Si tu pregunta no aparece, escríbenos y la
            añadimos para que la próxima persona la encuentre.
          </p>
        </Reveal>
      </section>

      <section className="contenedor pb-16 md:pb-24">
        <Reveal className="rounded-[2rem] border border-border/80 bg-superficie p-5 shadow-suave md:p-8">
          <FiltroCasuistica
            q={q}
            onQ={setQ}
            casuistica={casuistica}
            onCasuistica={setCasuistica}
            perfil=""
            onPerfil={() => {}}
            mostrarPerfil={false}
          />
        </Reveal>

        <p aria-live="polite" className="mt-8 text-sm text-texto-suave">
          {cargando
            ? 'Cargando preguntas…'
            : `${filtradas.length} ${filtradas.length === 1 ? 'pregunta' : 'preguntas'}`}
        </p>

        <div className="mt-4 max-w-3xl">
          {filtradas.length > 0 && <PreguntaAcordeon preguntas={filtradas} relatos={relatos} />}

          {!cargando && filtradas.length === 0 && (
            <div className="rounded-[1.75rem] border border-border bg-superficie-suave p-6">
              <p className="font-heading text-lg text-secundario">Todavía no tenemos esa pregunta</p>
              <p className="mt-2 text-sm leading-[1.7] text-texto-suave">
                Cuéntanosla y la respondemos. También puedes leer historias de personas que pasaron
                por algo parecido.
              </p>
              <Link
                to={RUTAS.contacto}
                className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-colors hover:bg-secundario"
              >
                Escríbenos tu pregunta
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12 rounded-[2rem] bg-superficie-suave p-7 md:p-10">
          <h2 className="font-heading text-2xl font-semibold text-secundario md:text-3xl">
            ¿Sigues con dudas?
          </h2>
          <p className="prosa-lectura mt-3 text-[1.02rem] leading-[1.7] text-texto-suave">
            Si tu situación tiene matices, lo mejor es contarla. Te orientamos hacia el recurso o el
            profesional adecuado, sin promesas que no podamos cumplir.
          </p>
          <Link
            to={RUTAS.contacto}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primario px-6 text-sm font-medium text-crema transition-all duration-200 hover:-translate-y-0.5 hover:bg-secundario"
          >
            Cuéntanos tu caso
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-texto-suave">
          Esta información es orientativa y no sustituye el asesoramiento de un profesional.
        </p>
      </section>
    </>
  );
}