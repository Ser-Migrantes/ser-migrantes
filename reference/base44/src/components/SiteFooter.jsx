import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import Divisor from './Divisor';
import { RUTAS } from '@/lib/urls';

const COLUMNAS = [
  {
    titulo: 'Explorar',
    enlaces: [
      { label: 'Inicio', to: RUTAS.inicio },
      { label: 'Historias de migrantes', to: RUTAS.historias },
      { label: 'Preguntas frecuentes', to: RUTAS.preguntas },
    ],
  },
  {
    titulo: 'Cómo ayudamos',
    enlaces: [
      { label: 'Servicios de acompañamiento', to: RUTAS.servicios },
      { label: 'Cuéntanos tu caso', to: RUTAS.contacto },
    ],
  },
];

const LEGAL = [
  { label: 'Aviso legal', to: RUTAS.avisoLegal },
  { label: 'Política de privacidad', to: RUTAS.privacidad },
  { label: 'Política de cookies', to: RUTAS.cookies },
];

export default function SiteFooter() {
  return (
    <>
    <Divisor tono="secundario" />
    <footer className="bg-secundario text-crema">
      <div className="contenedor pb-10">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
          <div>
            <BrandMark tone="light" />
            <p className="mt-5 max-w-sm font-heading text-xl leading-snug text-crema">
              Ser migrantes es construir un lugar para todos.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-crema/75">
              Historias, respuestas claras y acompañamiento para personas migrantes en España.
            </p>
          </div>

          {COLUMNAS.map((columna) => (
            <div key={columna.titulo}>
              <p className="etiqueta text-crema/60">{columna.titulo}</p>
              <ul className="mt-4 space-y-3">
                {columna.enlaces.map((enlace) => (
                  <li key={enlace.label}>
                    <Link
                      to={enlace.to}
                      className="inline-flex min-h-[28px] items-center text-sm text-crema/85 underline-offset-4 transition-colors hover:text-crema hover:underline"
                    >
                      {enlace.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-crema/20 pt-6">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {LEGAL.map((enlace) => (
              <li key={enlace.to}>
                <Link
                  to={enlace.to}
                  className="text-sm text-crema/80 underline-offset-4 transition-colors hover:text-crema hover:underline"
                >
                  {enlace.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/admin"
                className="text-sm text-crema/60 underline-offset-4 transition-colors hover:text-crema hover:underline"
              >
                Acceso del equipo
              </Link>
            </li>
          </ul>

          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-crema/65">
            Ser Migrantes ofrece información general y orientación inicial. No presta asesoramiento
            jurídico ni sustituye a un profesional. Los relatos son casos reales reescritos y
            adaptados para proteger la identidad de sus protagonistas.
          </p>
          <p className="mt-3 text-xs text-crema/55">
            © {new Date().getFullYear()} SeR MigranteS S.L. · sermigrantes.es
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}