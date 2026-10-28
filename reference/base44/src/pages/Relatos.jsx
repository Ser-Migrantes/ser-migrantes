import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useContenidoPublico from '@/hooks/useContenidoPublico';
import FiltroCasuistica from '@/components/FiltroCasuistica';
import RelatoCard from '@/components/RelatoCard';
import Reveal from '@/components/Reveal';
import { filtrarRelatos } from '@/lib/busqueda';
import { usePageMeta } from '@/lib/seo';
import { RUTAS } from '@/lib/urls';

export default function Relatos() {
  usePageMeta({
    titulo: 'Historias de migrantes en España | Ser Migrantes',
    descripcion:
      'Casos reales adaptados sobre documentación, arraigo, empleo, vivienda y familia. Encuentra la historia de una persona migrante que se parezca a la tuya.',
    ruta: RUTAS.historias,
  });

  const { relatos, cargando } = useContenidoPublico();
  const [q, setQ] = useState('');
  const [casuistica, setCasuistica] = useState('');
  const [perfil, setPerfil] = useState('');

  const filtrados = useMemo(
    () => filtrarRelatos(relatos, { q, casuistica, perfil }),
    [relatos, q, casuistica, perfil],
  );

  return (
    <>
      <section className="contenedor pb-8 pt-10 md:pt-16">
        <Reveal className="max-w-3xl">
          <p className="etiqueta text-primario">Historias reales adaptadas</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.06] text-secundario md:text-[3.2rem]">
            Historias de personas migrantes en España
          </h1>
          <p className="prosa-lectura mt-4 text-lg leading-[1.7] text-texto-suave">
            Cada relato es un caso real reescrito y adaptado para proteger la identidad de sus
            protagonistas. Filtra por situación o perfil y empieza por el que más se parezca al tuyo.
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
            perfil={perfil}
            onPerfil={setPerfil}
          />
        </Reveal>

        <p aria-live="polite" className="mt-8 text-sm text-texto-suave">
          {cargando
            ? 'Cargando historias…'
            : `${filtrados.length} ${filtrados.length === 1 ? 'historia encontrada' : 'historias encontradas'}`}
        </p>

        {!cargando && filtrados.length === 0 && (
          <div className="mt-4 rounded-[1.75rem] border border-border bg-superficie-suave p-6">
            <p className="font-heading text-lg text-secundario">
              No hemos encontrado una historia con esos filtros
            </p>
            <p className="mt-2 text-sm leading-[1.7] text-texto-suave">
              Prueba con otra situación o perfil. Y si prefieres contarlo tú,{' '}
              <Link
                to={RUTAS.contacto}
                className="font-medium text-primario underline decoration-acento decoration-2 underline-offset-4"
              >
                escríbenos tu caso
              </Link>
              .
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((relato, indice) => (
            <Reveal key={relato.id} delay={Math.min(indice, 5) * 60} className="h-full">
              <RelatoCard relato={relato} />
            </Reveal>
          ))}
        </div>

        <p className="mt-10 max-w-2xl border-t border-border pt-5 text-xs leading-relaxed text-texto-suave">
          Los relatos son casos reales reescritos y adaptados. Esta información es orientativa y no
          sustituye el asesoramiento de un profesional.
        </p>
      </section>
    </>
  );
}