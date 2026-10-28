const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

import { ESTILO_TARJETA } from './Campo';

const ETIQUETAS_EVENTO = {
  visita: 'Visitas',
  busqueda: 'Búsquedas',
  clic_servicio: 'Clics a servicios',
  clic_relato: 'Relatos vistos',
  solicitud: 'Formularios enviados',
};

export default function AdminResumen() {
  const [datos, setDatos] = useState(null);
  const [ultimas, setUltimas] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const [solicitudesTotal, eventos, relatos, preguntas, servicios, ultimasSolicitudes] =
        await Promise.all([
          db.entities.Solicitud.count({}),
          db.entities.Evento.aggregate({ query: {}, groupBy: 'tipo' }),
          db.entities.Microrelato.count({}),
          db.entities.Pregunta.count({}),
          db.entities.Servicio.count({}),
          db.entities.Solicitud.list({ sort: '-created_date', limit: 5 }),
        ]);

      setDatos({
        solicitudes: solicitudesTotal,
        eventos: eventos.rows || [],
        relatos,
        preguntas,
        servicios,
      });
      setUltimas(ultimasSolicitudes.items || []);
    };

    cargar();
  }, []);

  const totalEvento = (tipo) => {
    const fila = (datos?.eventos || []).find((item) => item.tipo === tipo);
    return fila?.count ?? 0;
  };

  const tarjetas = [
    { titulo: 'Solicitudes', valor: datos?.solicitudes ?? 0, destacada: true },
    { titulo: 'Visitas a la portada', valor: totalEvento('visita') },
    { titulo: 'Búsquedas', valor: totalEvento('busqueda') },
    { titulo: 'Clics a servicios', valor: totalEvento('clic_servicio') },
    { titulo: 'Relatos vistos', valor: totalEvento('clic_relato') },
    { titulo: 'Relatos', valor: datos?.relatos ?? 0 },
    { titulo: 'Preguntas', valor: datos?.preguntas ?? 0 },
    { titulo: 'Servicios', valor: datos?.servicios ?? 0 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tarjetas.map((tarjeta) => (
          <div
            key={tarjeta.titulo}
            className={`rounded-[1.5rem] p-5 ${
              tarjeta.destacada ? 'bg-primario text-crema-alta' : 'border border-verde/15 bg-crema-alta'
            }`}
          >
            <p className={`text-xs ${tarjeta.destacada ? 'text-crema-alta/80' : 'text-verde/70'}`}>
              {tarjeta.titulo}
            </p>
            <p
              className={`mt-2 font-heading text-3xl font-semibold ${
                tarjeta.destacada ? 'text-crema-alta' : 'text-verde'
              }`}
            >
              {datos ? tarjeta.valor : '—'}
            </p>
          </div>
        ))}
      </div>

      <div className={ESTILO_TARJETA}>
        <h2 className="font-heading text-lg font-semibold text-verde">Últimas solicitudes</h2>
        {ultimas.length === 0 ? (
          <p className="mt-3 text-sm text-tinta/70">No hay solicitudes todavía.</p>
        ) : (
          <ul className="mt-4 divide-y divide-verde/10">
            {ultimas.map((solicitud) => (
              <li key={solicitud.id} className="py-3">
                <p className="text-sm font-medium text-tinta">
                  {solicitud.nombre} · <span className="font-normal text-verde/80">{solicitud.email}</span>
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-tinta/65">{solicitud.necesidad}</p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-[0.7rem] leading-relaxed text-tinta/50">
          Los eventos de navegación se registran de forma anónima: no guardan datos personales de
          quien visita la web.
        </p>
      </div>
    </div>
  );
}