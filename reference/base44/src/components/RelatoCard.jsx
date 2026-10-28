import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { rutaRelato } from '@/lib/urls';

export default function RelatoCard({ relato }) {
  const etiquetas = (relato.etiquetas || []).slice(0, 3);

  return (
    <Link
      to={rutaRelato(relato)}
      className="group flex h-full flex-col rounded-[1.75rem] border border-border/80 bg-superficie p-6 shadow-suave transition-all duration-300 hover:-translate-y-1.5 hover:border-acento hover:shadow-elevada md:p-7"
    >
      <span className="etiqueta text-primario">{relato.casuistica}</span>
      <h3 className="mt-3 font-heading text-xl leading-tight text-secundario md:text-[1.35rem]">
        {relato.titulo}
      </h3>
      <p className="mt-3 flex-1 text-[0.97rem] leading-[1.7] text-texto-suave">{relato.resumen}</p>

      {etiquetas.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {etiquetas.map((etiqueta) => (
            <li
              key={etiqueta}
              className="rounded-full bg-superficie-suave px-2.5 py-1 text-[0.7rem] font-medium text-secundario"
            >
              {etiqueta}
            </li>
          ))}
        </ul>
      )}

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primario">
        Leer la historia completa
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}