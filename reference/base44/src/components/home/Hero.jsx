const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from 'react';
import { Image } from '@/components/ui/image';
import { ShieldCheck } from 'lucide-react';
import FiltroCasuistica from '@/components/FiltroCasuistica';
import ResultadosBusqueda from '@/components/ResultadosBusqueda';
import Boton from '@/components/Boton';
import Reveal from '@/components/Reveal';
import { filtrarPreguntas, filtrarRelatos } from '@/lib/busqueda';
import { RUTAS } from '@/lib/urls';

const IMAGEN_HERO =
'https://media.db.com/images/public/6adf86f7b399e0d3d17171c2/3271a1ce3_generated_image.png';

export default function Hero({ relatos, preguntas }) {
  const [q, setQ] = useState('');
  const [casuistica, setCasuistica] = useState('');
  const [perfil, setPerfil] = useState('');
  const [consultado, setConsultado] = useState(false);

  const hayFiltro = consultado || q.trim() !== '' || casuistica !== '' || perfil !== '';
  const relatosFiltrados = filtrarRelatos(relatos, { q, casuistica, perfil });
  const preguntasFiltradas = filtrarPreguntas(preguntas, { q, casuistica, perfil });

  const limpiar = () => {
    setQ('');
    setCasuistica('');
    setPerfil('');
    setConsultado(false);
  };

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-acento/20 blur-3xl" />
      
      <div className="contenedor relative grid gap-10 pb-12 pt-10 md:grid-cols-[1.06fr_0.94fr] md:items-center md:gap-14 md:pb-16 md:pt-16">
        <Reveal>
          <a
            href="tel:+34600982993"
            className="inline-flex items-center gap-2 rounded-full border border-secundario/20 bg-superficie/70 px-3.5 py-2 text-[0.82rem] font-semibold leading-snug text-secundario transition-colors hover:bg-superficie-suave">
            
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-acento" aria-hidden="true" />
            Llámanos o escríbenos al +34 600 982 993 (agenda tu cita en esta línea)
          </a>

          <h1 className="mt-6 font-heading text-[2.4rem] font-semibold leading-[1.05] text-secundario sm:text-5xl lg:text-[3.9rem]">Ser migrante es volver a empezar sin empezar de 0.

          </h1>

          <p className="prosa-lectura mt-6 text-lg leading-[1.7] text-texto-suave md:text-[1.15rem]">Llegas a un lugar nuevo pero traes contigo toda una vida, historia, familia, cultura, sueños. Cambiar de país no borra quién eres.

          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Boton to={RUTAS.historias}>Leer historias reales</Boton>
            <Boton to={RUTAS.contacto} variante="secundario">
              Cuéntanos tu caso
            </Boton>
          </div>

          <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-texto-suave">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primario" aria-hidden="true" />
            Casos reales adaptados y respuestas claras. Información orientativa, nunca asesoramiento
            jurídico.
          </p>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="overflow-hidden rounded-[2.5rem] rounded-tr-[6rem] shadow-flotante">
            <Image
              src={IMAGEN_HERO}
              alt="Mujer joven con mochila en una calle de barrio en España, con luz cálida de tarde"
              className="aspect-[4/5] h-auto w-full object-cover sm:aspect-[5/4] md:aspect-[4/5]"
              width={880}
              height={1100}
              loading="eager"
              fittingType="fill" />
            
          </div>
          <figure className="absolute -bottom-6 left-3 max-w-[16rem] rounded-[1.5rem] border border-border/70 bg-superficie p-5 shadow-elevada md:-left-6">
            <blockquote className="font-heading text-[1.05rem] leading-snug text-secundario">
              «Ser migrante es volver a empezar sin empezar de cero.»
            </blockquote>
          </figure>
        </Reveal>
      </div>

      <div className="contenedor relative pb-14 md:pb-20">
        <Reveal className="rounded-[2rem] border border-border/80 bg-superficie p-5 shadow-suave md:p-8">
          <h2 className="font-heading text-xl font-semibold text-secundario md:text-2xl">
            ¿Qué necesitas resolver hoy?
          </h2>
          <p className="mt-1.5 text-sm text-texto-suave">Busca por tu situación y verás historias y preguntas que se parecen a la tuya; o llamanos o escribenos al +34600982993

          </p>
          <div className="mt-5">
            <FiltroCasuistica
              q={q}
              onQ={setQ}
              casuistica={casuistica}
              onCasuistica={setCasuistica}
              perfil={perfil}
              onPerfil={setPerfil}
              onBuscar={() => setConsultado(true)} />
            
          </div>
          {hayFiltro &&
          <ResultadosBusqueda
            relatos={relatosFiltrados}
            preguntas={preguntasFiltradas}
            onLimpiar={limpiar} />

          }
        </Reveal>
      </div>
    </section>);

}