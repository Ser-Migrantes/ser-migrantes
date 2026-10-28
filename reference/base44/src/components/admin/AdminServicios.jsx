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
import { ESTADOS_SERVICIO, TIPOS_SERVICIO } from '@/lib/casuisticas';

const VACIO = {
  nombre: '',
  descripcion: '',
  tipo: 'propio',
  proveedor: '',
  url_destino: '',
  comision_modelo: '',
  estado: 'activo',
};

export default function AdminServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    const page = await db.entities.Servicio.list({ sort: 'nombre', limit: 100 });
    setServicios(page.items || []);
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

  const abrirEditar = (servicio) => {
    setForm({ ...VACIO, ...servicio });
    setError('');
    setAbierto(true);
  };

  const guardar = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setError('');
    const datos = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      tipo: form.tipo,
      proveedor: form.proveedor,
      url_destino: form.url_destino,
      comision_modelo: form.comision_modelo,
      estado: form.estado,
    };
    try {
      if (form.id) await db.entities.Servicio.update(form.id, datos);
      else await db.entities.Servicio.create(datos);
      setAbierto(false);
      await cargar();
    } catch (err) {
      setError('No se pudo guardar el servicio. Revisa los campos e inténtalo de nuevo.');
    }
    setGuardando(false);
  };

  const eliminar = async (servicio) => {
    if (!window.confirm(`¿Eliminar el servicio «${servicio.nombre}»?`)) return;
    await db.entities.Servicio.delete(servicio.id);
    await cargar();
  };

  return (
    <div className={ESTILO_TARJETA}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold text-verde">Servicios</h2>
          <p className="text-xs text-tinta/60">
            {cargando ? 'Cargando…' : `${servicios.length} servicios en el sistema`}
          </p>
        </div>
        <button
          type="button"
          onClick={abrirNuevo}
          className="inline-flex items-center gap-1.5 rounded-full bg-primario px-4 py-2 text-xs font-medium text-crema-alta"
        >
          <Plus className="h-4 w-4" />
          Nuevo servicio
        </button>
      </div>

      <ul className="mt-5 divide-y divide-verde/10">
        {servicios.map((servicio) => (
          <li key={servicio.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate font-heading text-base text-tinta">{servicio.nombre}</p>
              <p className="mt-0.5 text-xs text-verde/70">
                {servicio.tipo} · {servicio.estado}
                {servicio.proveedor ? ` · ${servicio.proveedor}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => abrirEditar(servicio)}
                aria-label={`Editar ${servicio.nombre}`}
                className="rounded-full p-2 text-verde hover:bg-verde/10"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => eliminar(servicio)}
                aria-label={`Eliminar ${servicio.nombre}`}
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
              {form.id ? 'Editar servicio' : 'Nuevo servicio'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={guardar} className="space-y-4">
            <Campo label="Nombre">
              <input
                className={ESTILO_INPUT}
                value={form.nombre}
                onChange={(e) => cambiar('nombre', e.target.value)}
                required
              />
            </Campo>

            <Campo label="Descripción">
              <textarea
                rows={4}
                className={ESTILO_INPUT}
                value={form.descripcion}
                onChange={(e) => cambiar('descripcion', e.target.value)}
                required
              />
            </Campo>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo label="Tipo">
                <select
                  className={ESTILO_INPUT}
                  value={form.tipo}
                  onChange={(e) => cambiar('tipo', e.target.value)}
                >
                  {TIPOS_SERVICIO.map((item) => (
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
                  {ESTADOS_SERVICIO.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>

            <Campo label="Proveedor">
              <input
                className={ESTILO_INPUT}
                value={form.proveedor}
                onChange={(e) => cambiar('proveedor', e.target.value)}
                placeholder="Wellcomy, gestorías colaboradoras…"
              />
            </Campo>

            <Campo label="Enlace externo (opcional)">
              <input
                className={ESTILO_INPUT}
                value={form.url_destino}
                onChange={(e) => cambiar('url_destino', e.target.value)}
                placeholder="Si está vacío, se solicita desde el formulario"
              />
            </Campo>

            <Campo label="Modelo comercial (uso interno)">
              <textarea
                rows={2}
                className={ESTILO_INPUT}
                value={form.comision_modelo}
                onChange={(e) => cambiar('comision_modelo', e.target.value)}
              />
            </Campo>

            {error && <p className="text-xs text-destructive">{error}</p>}

            <DialogFooter>
              <button
                type="submit"
                disabled={guardando}
                className="rounded-full bg-primario px-5 py-2.5 text-sm font-medium text-crema-alta disabled:opacity-60"
              >
                {guardando ? 'Guardando…' : 'Guardar servicio'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}