import { Link } from 'react-router-dom';

const BASE =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 py-3 text-center text-[0.95rem] font-medium transition-all duration-200';

const VARIANTES = {
  primario:
    'bg-primario text-crema shadow-suave hover:-translate-y-0.5 hover:bg-secundario hover:shadow-elevada',
  secundario:
    'border border-primario/35 bg-superficie/60 text-primario hover:-translate-y-0.5 hover:border-primario hover:bg-superficie-suave',
  claro: 'bg-crema text-primario hover:-translate-y-0.5 hover:bg-white hover:shadow-elevada',
  contornoClaro:
    'border border-crema/45 text-crema hover:-translate-y-0.5 hover:border-crema hover:bg-crema/10',
  enlace:
    'min-h-0 px-0 py-0 text-primario underline decoration-acento decoration-2 underline-offset-4 hover:text-secundario',
};

export default function Boton({ to, href, variante = 'primario', className = '', children, ...resto }) {
  const clases = `${BASE} ${VARIANTES[variante] || VARIANTES.primario} ${className}`;

  if (to) {
    return (
      <Link to={to} className={clases} {...resto}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={clases} {...resto}>
        {children}
      </a>
    );
  }
  return (
    <button className={clases} {...resto}>
      {children}
    </button>
  );
}