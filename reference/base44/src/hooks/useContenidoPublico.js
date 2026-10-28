const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

export default function useContenidoPublico() {
  const [contenido, setContenido] = useState({
    relatos: [],
    preguntas: [],
    servicios: [],
    cargando: true,
  });

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      const [relatos, preguntas, servicios] = await Promise.all([
        db.entities.Microrelato.filter(
          { estado: 'publicado' },
          { sort: '-fecha_publicacion', limit: 100 },
        ),
        db.entities.Pregunta.filter({ estado: 'publicado' }, { sort: 'pregunta', limit: 200 }),
        db.entities.Servicio.filter({ estado: 'activo' }, { sort: 'nombre', limit: 50 }),
      ]);

      if (!activo) return;
      setContenido({
        relatos: relatos.items || [],
        preguntas: preguntas.items || [],
        servicios: servicios.items || [],
        cargando: false,
      });
    };

    cargar();
    return () => {
      activo = false;
    };
  }, []);

  return contenido;
}