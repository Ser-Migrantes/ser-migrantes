const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };


// Las métricas nunca deben romper la experiencia de quien navega.
export function registrarEvento({ tipo, referencia = '', termino = '' }) {
  db.entities.Evento.create({
    tipo,
    referencia,
    termino,
    fecha: new Date().toISOString(),
  }).catch(() => {});
}