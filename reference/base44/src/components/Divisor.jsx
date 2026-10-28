const RELLENOS = {
  'superficie-suave': 'text-superficie-suave',
  superficie: 'text-superficie',
  fondo: 'text-fondo',
  'primario-suave': 'text-primario-suave',
  secundario: 'text-secundario',
  primario: 'text-primario',
};

export default function Divisor({ tono = 'superficie-suave', className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none -mb-px w-full overflow-hidden leading-[0] ${className}`}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={`block h-8 w-full fill-current md:h-14 ${RELLENOS[tono] || RELLENOS['superficie-suave']}`}
        focusable="false"
      >
        <path d="M0 90 C 260 22 520 18 720 44 C 940 72 1180 12 1440 50 L1440 90 Z" />
      </svg>
    </div>
  );
}