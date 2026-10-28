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
import { CASUISTICAS, ESTADOS_CONTENIDO, PERFILES } from '@/lib/casuisticas';
import { generarSlug } from '@/lib/slug';

const VACIO = {
  titulo: '',
  slug: '',
  resumen: '',
  contenido: '',
  casuistica: CASUISTICAS[0],
  perfil: PERFILES[0],
  etiquetasTexto: '',
  estado: 'borrador',
  fecha_publicacion: '',
  cta_principal: 'Cuéntanos tu caso',
  servicio_relacionado: '',
};

export default function AdminRelatos() {
  const [relatos, setRelatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    const page = await db.entities.Microrelato.list({ sort: '-updated_date', limit: 200 });
    setRelatos(page.items || []);
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

  const abrirEditar = (relato) => {
    setForm({ ...VACIO, ...relato, etiquetasTexto: (relato.etiquetas || []).join(', ') });
    setError('');
    setAbierto(true);
  };

  const guardar = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError('');
    const datos = {
      titulo: form.titulo,
      slug: form.slug || generarSlug(form.titulo),
      resumen: form.resumen,
      contenido: form.contenido,
      casuistica: form.casuistica,
      perfil: form.perfil,
      etiquetas: form.etiquetasTexto.split(',').map((t) => t.trim()).filter(Boolean),
      estado: form.estado,
      fecha_publicacion: form.fecha_publicacion || undefined,
      cta_principal: form.cta_principal,
      servicio_relacionado: form.servicio_relacionado,
    };
    try {
      if (form.id) await db.entities.Microrelato.update(form.id, datos);
      else await db.entities.Microrelato.create(datos);
      setAbierto(false);
      await cargar();
    } catch (err) {
      setError('No se pudo guardar el relato. Revisa los campos e inténtalo de nuevo.');
    }
    setGuardando(false);
  };

  const eliminar = async (relato) => {
    if (!window.confirm(`¿Eliminar el relato «${relato.titulo}»?`)) return;
    await db.entities.Microrelato.delete(relato.id);
    await cargar();
  };

  return (
    <div className={ESTILO_TARJETA}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold text-verde">Relatos</h2>
          <p className="text-xs text-tinta/60">
            {cargando ? 'Cargando…' : `${relatos.length} relatos en el sistema`}
          </p>
        </div>
        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex items-center gap-1.5 rounded-full bg-primario px-4 py-2 text-xs font-medium text-crema-alta"
        >
          <Plus className="h-4 w-4" />
          Nuevo relato
        </button>
      </div>

      <ul className="mt-5 divide-y divide-verde/10">
        {relatos.map((relato) => (
          <li key={relato.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-heading text-base text-tinta">{relato.titulo}</p>
              <p className="mt-0.5 text-xs text-verde/70">
                {relato.casuistica} · {relato.estado}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => abrirEditar(relato)}
                aria-label={`Editar ${relato.titulo}`}
                className="rounded-full p-2 text-verde hover:bg-verde/10"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => eliminar(relato)}
                aria-label={`Eliminar ${relato.titulo}`}
                className="rounded-full p-2 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto bg-crema-alta">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-verde">
              {form.id ? 'Editar relato' : 'Nuevo relato'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={guardar} className="space-y-4">
            <Campo label="Título">
              <input
                className={ESTILO_INPUT}
                value={form.titulo}
                onChange={(e) => cambiar('titulo', e.target.value)}
                required
              />
            </Campo>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Slug (URL)">
                <input
                  className={ESTILO_INPUT}
                  value={form.slug}
                  onChange={(e) => cambiar('slug', e.target.value)}
                  placeholder="se genera del título"
                />
              </Campo>
              <Campo label="Fecha de publicación">
                <input
                  type="date"
                  className={ESTILO_INPUT}
                  value={form.fecha_publicacion || ''}
                  onChange={(e) => cambiar('fecha_publicacion', e.target.value)}
                />
              </Campo>
            </div>

            <Campo label="Resumen">
              <textarea
                rows={2}
                className={ESTILO_INPUT}
                value={form.resumen}
                onChange={(e) => cambiar('resumen', e.target.value)}
                required
              />
            </Campo>

            <Campo label="Contenido (separa los párrafos con una línea en blanco)">
              <textarea
                rows={9}
                className={ESTILO_INPUT}
                value={form.contenido}
                onChange={(e) => cambiar('contenido', e.target.value)}
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
              <Campo label="Perfil">
                <select
                  className={ESTILO_INPUT}
                  value={form.perfil}
                  onChange={(e) => cambiar('perfil', e.target.value)}
                >
                  {PERFILES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Etiquetas (separadas por comas)">
                <input
                  className={ESTILO_INPUT}
                  value={form.etiquetasTexto}
                  onChange={(e) => cambiar('etiquetasTexto', e.target.value)}
                />
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

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Texto del botón">
                <input
                  className={ESTILO_INPUT}
                  value={form.cta_principal}
                  onChange={(e) => cambiar('cta_principal', e.target.value)}
                />
              </Campo>
              <Campo label="Servicio relacionado">
                <input
                  className={ESTILO_INPUT}
                  value={form.servicio_relacionado}
                  onChange={(e) => cambiar('servicio_relacionado', e.target.value)}
                  placeholder="Nombre exacto del servicio"
                />
              </Campo>
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <DialogFooter>
              <button
                type="submit"
                disabled={guardando}
                className="rounded-full bg-primario px-5 py-2.5 text-sm font-medium text-crema-alta disabled:opacity-60"
              >
                {guardando ? 'Guardando…' : 'Guardar relato'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}