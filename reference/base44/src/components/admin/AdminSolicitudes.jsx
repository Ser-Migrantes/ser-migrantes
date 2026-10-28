const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

import { Trash2, Mail, Phone } from 'lucide-react';
import { ESTILO_TARJETA } from './Campo';

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    const page = await db.entities.Solicitud.list({ sort: '-created_date', limit: 200 });
    setSolicitudes(page.items || []);
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const eliminar = async (solicitud) => {
    if (!window.confirm('¿Eliminar esta solicitud de la base de datos?')) return;
    await db.entities.Solicitud.delete(solicitud.id);
    await cargar();
  };

  return (
    <div className={ESTILO_TARJETA}>
      <h2 className="font-heading text-xl font-semibold text-verde">Solicitudes recibidas</h2>
      <p className="text-xs text-tinta/60">
        {cargando ? 'Cargando…' : `${solicitudes.length} solicitudes`}
      </p>

      {!cargando && solicitudes.length === 0 && (
        <p className="mt-6 text-sm text-tinta/70">Todavía no hay solicitudes enviadas desde el formulario.</p>
      )}

      <ul className="mt-5 space-y-4">
        {solicitudes.map((solicitud) => (
          <li key={solicitud.id} className="rounded-2xl border border-verde/15 bg-crema-alta p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-base text-tinta">{solicitud.nombre}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-verde/80">
                  <a href={`mailto:${solicitud.email}`} className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {solicitud.email}
                  </a>
                  {solicitud.telefono && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {solicitud.telefono}
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => eliminar(solicitud)}
                aria-label="Eliminar solicitud"
                className="rounded-full p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-tinta/80">
              {solicitud.necesidad}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-[0.7rem] text-verde/75">
              {solicitud.servicio_interes && (
                <span className="rounded-full bg-acento/60 px-2.5 py-1 text-tinta">
                  {solicitud.servicio_interes}
                </span>
              )}
              {solicitud.microrelato_origen && (
                <span className="rounded-full border border-verde/25 px-2.5 py-1">
                  desde relato: {solicitud.microrelato_origen}
                </span>
              )}
              <span className="rounded-full border border-verde/25 px-2.5 py-1">
                consentimiento: {solicitud.consentimiento ? 'sí' : 'no'}
              </span>
              {solicitud.created_date && (
                <span className="px-1 py-1">
                  {new Date(solicitud.created_date).toLocaleString('es-ES')}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}