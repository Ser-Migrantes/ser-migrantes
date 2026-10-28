import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import BrandMark from './BrandMark';
import Boton from './Boton';
import { RUTAS } from '@/lib/urls';

const ENLACES = [
  { label: 'Inicio', to: RUTAS.inicio },
  { label: 'Historias', to: RUTAS.historias },
  { label: 'Preguntas frecuentes', to: RUTAS.preguntas },
  { label: 'Servicios', to: RUTAS.servicios },
  { label: 'Contacto', to: RUTAS.contacto },
];

const claseEscritorio = ({ isActive }) =>
  `rounded-full px-3.5 py-2.5 text-[0.95rem] transition-colors duration-200 ${
    isActive
      ? 'bg-acento/30 font-medium text-texto'
      : 'text-texto/80 hover:bg-acento/30 hover:text-texto'
  }`;

export default function SiteHeader() {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-fondo/90 backdrop-blur-md">
      <div className="contenedor flex min-h-[76px] items-center justify-between gap-4 py-3">
        <Link
          to={RUTAS.inicio}
          aria-label="Ser Migrantes, ir al inicio"
          onClick={() => setAbierto(false)}
          className="rounded-full"
        >
          <BrandMark />
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 lg:flex">
          {ENLACES.map((enlace) => (
            <NavLink key={enlace.to} to={enlace.to} end={enlace.to === '/'} className={claseEscritorio}>
              {enlace.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Boton to={RUTAS.contacto} className="hidden px-5 py-2.5 text-sm sm:inline-flex">
            Cuéntanos tu caso
          </Boton>
          <button
            type="button"
            onClick={() => setAbierto((valor) => !valor)}
            aria-label={abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-primario/25 text-primario transition-colors hover:bg-acento/30 lg:hidden"
          >
            {abierto ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Navegación móvil"
          className="border-t border-border/70 bg-superficie lg:hidden"
        >
          <div className="contenedor flex flex-col gap-1 py-3">
            {ENLACES.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                end={enlace.to === '/'}
                onClick={() => setAbierto(false)}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center rounded-2xl px-4 text-[0.95rem] transition-colors ${
                    isActive
                      ? 'bg-acento/30 font-medium text-texto'
                      : 'text-texto/85 hover:bg-acento/30'
                  }`
                }
              >
                {enlace.label}
              </NavLink>
            ))}
            <Boton to={RUTAS.contacto} onClick={() => setAbierto(false)} className="mt-2 w-full">
              Cuéntanos tu caso
            </Boton>
          </div>
        </nav>
      )}
    </header>
  );
}