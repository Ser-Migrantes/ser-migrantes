const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

import useContenidoPublico from '@/hooks/useContenidoPublico';
import Reveal from '@/components/Reveal';
import { registrarEvento } from '@/lib/eventos';
import { usePageMeta } from '@/lib/seo';
import { RUTAS } from '@/lib/urls';

const ESTADO_INICIAL = {
  nombre: '',
  email: '',
  telefono: '',
  necesidad: '',
  servicio_interes: '',
  consentimiento: false,
};

const CAMPO =
  'min-h-[48px] w-full rounded-2xl border border-border bg-fondo px-4 py-3 text-[0.95rem] text-texto placeholder:text-texto-suave/60 focus:border-primario focus:outline-none focus:ring-2 focus:ring-primario/25';

const ETIQUETA_CAMPO = 'text-sm font-medium text-texto';

export default function Contacto() {
  usePageMeta({
    titulo: 'Cuéntanos tu caso | Ser Migrantes',
    descripcion:
      'Escríbenos y te orientamos con información clara sobre documentación, empleo, vivienda o cualquier duda de tu proceso migratorio en España.',
    ruta: RUTAS.contacto,
  });

  const { servicios, relatos } = useContenidoPublico();
  const params = new URLSearchParams(window.location.search);
  const servicioParam = params.get('servicio') || '';
  const relatoParam = params.get('relato') || '';
  const relatoOrigen = relatos.find((relato) => relato.slug === relatoParam);

  const [formulario, setFormulario] = useState({ ...ESTADO_INICIAL, servicio_interes: servicioParam });
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const actualizar = (campo, valor) => {
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
    setErrores((previo) => ({ ...previo, [campo]: undefined }));
  };

  const validar = () => {
    const nuevos = {};
    if (!formulario.nombre.trim()) nuevos.nombre = 'Dinos cómo te llamas o cómo prefieres que te llamemos.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email.trim()))
      nuevos.email = 'Necesitamos un correo válido para responderte.';
    if (formulario.necesidad.trim().length < 15)
      nuevos.necesidad = 'Cuéntanos un poco más para poder orientarte bien.';
    if (!formulario.consentimiento)
      nuevos.consentimiento = 'Necesitamos tu consentimiento para poder responderte.';
    return nuevos;
  };

  const enviar = async (event) => {
    event.preventDefault();
    const nuevos = validar();
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    await db.entities.Solicitud.create({
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      telefono: formulario.telefono.trim(),
      necesidad: formulario.necesidad.trim(),
      servicio_interes: formulario.servicio_interes,
      microrelato_origen: relatoParam,
      consentimiento: formulario.consentimiento,
      fecha: new Date().toISOString(),
    });
    registrarEvento({ tipo: 'solicitud', referencia: formulario.servicio_interes });
    setEnviando(false);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <section className="contenedor py-16 md:py-24">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-border/80 bg-superficie p-8 text-center shadow-suave md:p-12">
          <CheckCircle2 className="mx-auto h-11 w-11 text-primario" aria-hidden="true" />
          <h1 className="mt-5 font-heading text-3xl font-semibold text-secundario">
            Hemos recibido tu mensaje
          </h1>
          <p className="mt-3 text-[1.02rem] leading-[1.7] text-texto-suave">
            Gracias por confiar en Ser Migrantes. Vamos a leer tu caso con calma y te responderemos
            al correo que nos has dejado.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to={RUTAS.historias}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primario px-5 text-sm font-medium text-crema transition-colors hover:bg-secundario"
            >
              Leer historias
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to={RUTAS.preguntas}
              className="inline-flex min-h-[44px] items-center rounded-full border border-primario/35 px-5 text-sm font-medium text-primario transition-colors hover:bg-superficie-suave"
            >
              Ver preguntas frecuentes
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="contenedor pb-8 pt-10 md:pt-16">
        <Reveal className="max-w-2xl">
          <p className="etiqueta text-primario">Contacto</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-[1.06] text-secundario md:text-[3.2rem]">
            Cuéntanos tu caso
          </h1>
          <p className="prosa-lectura mt-4 text-lg leading-[1.7] text-texto-suave">
            Escríbenos con tus palabras. No necesitas saber cómo se llama tu trámite: para eso
            estamos.
          </p>
        </Reveal>
      </section>

      <section className="contenedor grid gap-8 pb-16 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:pb-24">
        <Reveal
          as="form"
          onSubmit={enviar}
          noValidate
          className="rounded-[2rem] border border-border/80 bg-superficie p-6 shadow-suave md:p-8"
        >
          {relatoOrigen && (
            <p className="mb-5 rounded-2xl bg-acento/30 px-4 py-3 text-sm leading-relaxed text-texto">
              Has llegado desde la historia «{relatoOrigen.titulo}». Lo tendremos en cuenta al
              responderte.
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="nombre" className={ETIQUETA_CAMPO}>
                Nombre o alias *
              </label>
              <input
                id="nombre"
                value={formulario.nombre}
                onChange={(event) => actualizar('nombre', event.target.value)}
                className={`mt-1.5 ${CAMPO}`}
                placeholder="Cómo quieres que te llamemos"
                autoComplete="name"
              />
              {errores.nombre && <p className="mt-1 text-xs text-destructive">{errores.nombre}</p>}
            </div>

            <div>
              <label htmlFor="email" className={ETIQUETA_CAMPO}>
                Correo electrónico *
              </label>
              <input
                id="email"
                type="email"
                value={formulario.email}
                onChange={(event) => actualizar('email', event.target.value)}
                className={`mt-1.5 ${CAMPO}`}
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
              />
              {errores.email && <p className="mt-1 text-xs text-destructive">{errores.email}</p>}
            </div>

            <div>
              <label htmlFor="telefono" className={ETIQUETA_CAMPO}>
                Teléfono (opcional)
              </label>
              <input
                id="telefono"
                value={formulario.telefono}
                onChange={(event) => actualizar('telefono', event.target.value)}
                className={`mt-1.5 ${CAMPO}`}
                placeholder="Solo si prefieres que te llamemos"
                autoComplete="tel"
              />
            </div>

            <div>
              <label htmlFor="servicio" className={ETIQUETA_CAMPO}>
                Sobre qué servicio preguntas
              </label>
              <select
                id="servicio"
                value={formulario.servicio_interes}
                onChange={(event) => actualizar('servicio_interes', event.target.value)}
                className={`mt-1.5 ${CAMPO}`}
              >
                <option value="">Todavía no lo sé</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id} value={servicio.nombre}>
                    {servicio.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="necesidad" className={ETIQUETA_CAMPO}>
              Cuéntanos qué necesitas *
            </label>
            <textarea
              id="necesidad"
              rows={6}
              value={formulario.necesidad}
              onChange={(event) => actualizar('necesidad', event.target.value)}
              className={`mt-1.5 ${CAMPO} resize-none py-3`}
              placeholder="En qué punto estás, qué has intentado y qué te gustaría resolver."
            />
            {errores.necesidad && <p className="mt-1 text-xs text-destructive">{errores.necesidad}</p>}
          </div>

          <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed text-texto-suave">
            <input
              type="checkbox"
              checked={formulario.consentimiento}
              onChange={(event) => actualizar('consentimiento', event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-secundario/40 accent-primario"
            />
            <span>
              Doy mi consentimiento para que Ser Migrantes use estos datos únicamente para
              responderme. No se comparten con terceros. *
            </span>
          </label>
          {errores.consentimiento && (
            <p className="mt-1 text-xs text-destructive">{errores.consentimiento}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primario px-7 text-[0.95rem] font-medium text-crema transition-all duration-200 hover:-translate-y-0.5 hover:bg-secundario hover:shadow-elevada disabled:opacity-60"
          >
            {enviando ? 'Enviando…' : 'Enviar mi mensaje'}
            {!enviando && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
          </button>

          <p className="mt-4 text-xs leading-relaxed text-texto-suave">
            Al enviar aceptas la{' '}
            <Link
              to={RUTAS.privacidad}
              className="font-medium text-primario underline underline-offset-2"
            >
              política de privacidad
            </Link>
            .
          </p>
        </Reveal>

        <aside className="space-y-5">
          <div className="rounded-[1.75rem] bg-acento p-6">
            <h2 className="font-heading text-xl font-semibold text-texto">Qué pasa después</h2>
            <ul className="mt-4 space-y-3 text-sm leading-[1.7] text-texto/80">
              <li>Leemos tu caso y lo comentamos en equipo.</li>
              <li>Te respondemos al correo con información clara y el siguiente paso.</li>
              <li>Si hace falta un servicio, te decimos cuál y qué incluye antes de nada.</li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-border/80 bg-superficie p-6 shadow-suave">
            <h2 className="font-heading text-lg font-semibold text-secundario">Antes de escribir</h2>
            <p className="mt-2 text-sm leading-[1.7] text-texto-suave">
              Quizá tu duda ya está respondida. Tenemos preguntas frecuentes ordenadas por situación.
            </p>
            <Link
              to={RUTAS.preguntas}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primario underline-offset-4 hover:underline"
            >
              Buscar en las preguntas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <p className="flex items-start gap-2 px-1 text-xs leading-relaxed text-texto-suave">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primario" aria-hidden="true" />
            Ser Migrantes ofrece orientación inicial e información general. No presta asesoramiento
            jurídico ni sustituye a un profesional.
          </p>
        </aside>
      </section>
    </>
  );
}