import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RelatoCard from '@/components/RelatoCard';
import Reveal from '@/components/Reveal';
import { RUTAS } from '@/lib/urls';

export default function HistoriasDestacadas({ relatos }) {
  if (!relatos?.length) return null;

  return (
    <section className="seccion bg-superficie-suave">
      <div className="contenedor">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="etiqueta text-primario">Historias</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-secundario md:text-[2.6rem]">
              Historias que se parecen a la tuya.
            </h2>
            <p className="mt-4 text-base leading-[1.7] text-texto-suave md:text-[1.05rem]">
              Casos reales reescritos y adaptados para proteger la identidad de sus protagonistas.
            </p>
          </div>
          <Link
            to={RUTAS.historias}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-secundario/25 px-5 text-sm font-medium text-secundario transition-colors hover:border-secundario hover:bg-superficie"
          >
            Ver todas las historias
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {relatos.map((relato, indice) => (
            <Reveal key={relato.id} delay={indice * 80} className="h-full">
              <RelatoCard relato={relato} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}