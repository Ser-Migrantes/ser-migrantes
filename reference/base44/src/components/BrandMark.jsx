export default function BrandMark({ className = '', tone = 'dark' }) {
  const texto = tone === 'light' ? 'text-crema' : 'text-secundario';
  const circulo =
    tone === 'light' ? 'bg-crema text-secundario' : 'bg-primario text-crema';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded-full ${circulo}`}>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M15.7 8.3 13.3 13.3 8.3 15.7l2.4-5z" />
        </svg>
      </span>
      <span className={`font-heading text-[1.2rem] font-semibold tracking-tight ${texto}`}>
        SeR MigranteS
      </span>
    </span>
  );
}