const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from 'react';

import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Campo, { ESTILO_INPUT, ESTILO_TARJETA } from './Campo';
import { CASUISTICAS, ESTADOS_CONTENIDO } from '@/lib/casuisticas';

const VACIO = {
  pregunta: '',
  respuesta: '',
  casuistica: CASUISTICAS[0],
  etiquetasTexto: '',
  asociadosTexto: '',
  estado: 'borrador',
};

export default function AdminPreguntas() {
  const [preguntas, setPreguntas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    const page = await db.entities.Pregunta.list({ sort: '-updated_date', limit: 300 });
    setPreguntas(page.items || []);
    setCargando(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const cambiar = (campo, valor) => setForm((previo) => ({ ...previo, [campo]: valor }));

  const abrirNuevo = () => {
    setForm(VACIO);
    setError('');
    setAbierto(true);
  };

  const abrirEditar = (pregunta) => {
    setForm({
      ...VACIO,
      ...pregunta,
      etiquetasTexto: (pregunta.etiquetas || []).join(', '),
      asociadosTexto: (pregunta.microrelatos_asociados || []).join(', '),
    });
    setError('');
    setAbierto(true);
  };

  const guardar = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError('');
    const datos = {
      pregunta: form.pregunta,
      respuesta: form.respuesta,
      casuistica: form.casuistica,
      etiquetas: form.etiquetasTexto.split(',').map((t) => t.trim()).filter(Boolean),
      microrelatos_asociados: form.asociadosTexto.split(',').map((t) => t.trim()).filter(Boolean),
      estado: form.estado,
    };
    try {
      if (form.id) await db.entities.Pregunta.update(form.id, datos);
      else await db.entities.Pregunta.create(datos);
      setAbierto(false);
      await cargar();
    } catch (err) {
      setError('No se pudo guardar la pregunta. Revisa los campos e inténtalo de nuevo.');
    }
    setGuardando(false);
  };

  const eliminar = async (pregunta) => {
    if (!window.confirm('¿Eliminar esta pregunta?')) return;
    await db.entities.Pregunta.delete(pregunta.id);
    await cargar();
  };

  return (
    <div className={ESTILO_TARJETA}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold text-verde">Preguntas frecuentes</h2>
          <p className="text-xs text-tinta/60">
            {cargando ? 'Cargando…' : `${preguntas.length} preguntas en el sistema`}
          </p>
        </div>
        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex items-center gap-1.5 rounded-full bg-primario px-4 py-2 text-xs font-medium text-crema-alta"
        >
          <Plus className="h-4 w-4" />
          Nueva pregunta
        </button>
      </div>

      <ul className="mt-5 divide-y divide-verde/10">
        {preguntas.map((pregunta) => (
          <li key={pregunta.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-heading text-base text-tinta">{pregunta.pregunta}</p>
              <p className="mt-0.5 text-xs text-verde/70">
                {pregunta.casuistica || 'Sin casuística'} · {pregunta.estado}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => abrirEditar(pregunta)}
                aria-label={`Editar ${pregunta.pregunta}`}
                className="rounded-full p-2 text-verde hover:bg-verde/10"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => eliminar(pregunta)}
                aria-label={`Eliminar ${pregunta.pregunta}`}
                className="rounded-full p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto bg-crema-alta">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-verde">
              {form.id ? 'Editar pregunta' : 'Nueva pregunta'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={guardar} className="space-y-4">
            <Campo label="Pregunta">
              <input
                className={ESTILO_INPUT}
                value={form.pregunta}
                onChange={(e) => cambiar('pregunta', e.target.value)}
                required
              />
            </Campo>

            <Campo label="Respuesta">
              <textarea
                rows={6}
                className={ESTILO_INPUT}
                value={form.respuesta}
                onChange={(e) => cambiar('respuesta', e.target.value)}
                required
              />
            </Campo>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Casuística">
                <select
                  className={ESTILO_INPUT}
                  value={form.casuistica}
                  onChange={(e) => cambiar('casuistica', e.target.value)}
                >
                  {CASUISTICAS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Estado">
                <select
                  className={ESTILO_INPUT}
                  value={form.estado}
                  onChange={(e) => cambiar('estado', e.target.value)}
                >
                  {ESTADOS_CONTENIDO.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>

            <Campo label="Etiquetas (separadas por comas)">
              <input
                className={ESTILO_INPUT}
                value={form.etiquetasTexto}
                onChange={(e) => cambiar('etiquetasTexto', e.target.value)}
              />
            </Campo>

            <Campo label="Relatos asociados (slugs separados por comas)">
              <input
                className={ESTILO_INPUT}
                value={form.asociadosTexto}
                onChange={(e) => cambiar('asociadosTexto', e.target.value)}
                placeholder="tres-viajes-para-el-nie"
              />
            </Campo>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <DialogFooter>
              <button
                type="submit"
                disabled={guardando}
                className="rounded-full bg-primario px-5 py-2.5 text-sm font-medium text-crema-alta disabled:opacity-60"
              >
                {guardando ? 'Guardando…' : 'Guardar pregunta'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}