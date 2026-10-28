import { Search } from 'lucide-react';
import { CASUISTICAS, PERFILES } from '@/lib/casuisticas';
import { registrarEvento } from '@/lib/eventos';

const CHIP_BASE =
  'inline-flex min-h-[44px] items-center rounded-full px-4 text-[0.8rem] font-medium transition-colors duration-200';

export default function FiltroCasuistica({
  q,
  onQ,
  casuistica,
  onCasuistica,
  perfil,
  onPerfil,
  onBuscar,
  mostrarPerfil = true,
}) {
  const claseChip = (activo) =>
    activo
      ? `${CHIP_BASE} bg-primario text-crema`
      : `${CHIP_BASE} border border-secundario/25 text-secundario hover:border-secundario hover:bg-acento/30`;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        registrarEvento({ tipo: 'busqueda', termino: q, referencia: casuistica });
        onBuscar?.();
      }}
      className="w-full"
      role="search"
    >
      <label htmlFor="busqueda" className="text-sm font-semibold text-secundario">
        Busca por tu situación
      </label>
      <div className="mt-3 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secundario/60"
            aria-hidden="true"
          />
          <input
            id="busqueda"
            value={q}
            onChange={(event) => onQ(event.target.value)}
            placeholder="Ej.: cómo pedir cita para el NIE, buscar habitación, homologar un título…"
            className="min-h-[48px] w-full rounded-full border border-border bg-fondo py-3 pl-11 pr-4 text-[0.95rem] text-texto placeholder:text-texto-suave/70 focus:border-primario focus:outline-none focus:ring-2 focus:ring-primario/25"
          />
        </div>
        <button
          type="submit"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-primario px-7 text-[0.95rem] font-medium text-crema transition-all duration-200 hover:-translate-y-0.5 hover:bg-secundario hover:shadow-elevada"
        >
          Buscar casos
        </button>
      </div>

      <fieldset className="mt-5">
        <legend className="sr-only">Filtrar por tema</legend>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onCasuistica('')} className={claseChip(casuistica === '')}>
            Todas
          </button>
          {CASUISTICAS.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={casuistica === item}
              onClick={() => onCasuistica(casuistica === item ? '' : item)}
              className={claseChip(casuistica === item)}
            >
              {item}
            </button>
          ))}
        </div>
      </fieldset>

      {mostrarPerfil && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label htmlFor="perfil" className="text-sm font-medium text-texto-suave">
            Perfil
          </label>
          <select
            id="perfil"
            value={perfil}
            onChange={(event) => onPerfil(event.target.value)}
            className="min-h-[44px] rounded-full border border-border bg-fondo px-4 text-[0.85rem] text-texto focus:border-primario focus:outline-none focus:ring-2 focus:ring-primario/25"
          >
            <option value="">Cualquier perfil</option>
            {PERFILES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}
    </form>
  );
}