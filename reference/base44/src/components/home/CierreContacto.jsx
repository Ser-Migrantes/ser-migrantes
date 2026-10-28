const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Image } from '@/components/ui/image';
import Boton from '@/components/Boton';
import Reveal from '@/components/Reveal';
import { RUTAS } from '@/lib/urls';

const IMAGEN_CIERRE =
  'https://media.db.com/images/public/6adf86f7b399e0d3d17171c2/42995b94b_generated_image.png';

export default function CierreContacto() {
  return (
    <section className="seccion">
      <div className="contenedor">
        <Reveal className="grid overflow-hidden rounded-[2.5rem] border border-border/80 bg-superficie shadow-suave md:grid-cols-[1fr_0.9fr]">
          <div className="p-8 md:p-14">
            <p className="etiqueta text-primario">Cuéntanos tu caso</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold leading-[1.12] text-secundario md:text-[2.6rem]">
              Ser migrantes es construir un lugar para todos.
            </h2>
            <p className="prosa-lectura mt-4 text-base leading-[1.7] text-texto-suave md:text-[1.05rem]">
              Escríbenos con tus palabras. No necesitas saber cómo se llama tu trámite: para eso
              estamos. Te respondemos con información clara y sin compromiso.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Boton to={RUTAS.contacto}>Escríbenos tu caso</Boton>
              <Boton to={RUTAS.preguntas} variante="secundario">
                Leer preguntas frecuentes
              </Boton>
            </div>
          </div>
          <div className="relative min-h-[240px] md:min-h-full">
            <Image
              src={IMAGEN_CIERRE}
              alt="Grupo diverso de personas conversando en un patio comunitario con plantas y luz cálida"
              className="h-full w-full object-cover"
              width={900}
              height={900}
              loading="lazy"
              fittingType="fill"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}