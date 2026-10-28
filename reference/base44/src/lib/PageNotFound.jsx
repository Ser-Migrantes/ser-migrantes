import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Boton from '@/components/Boton';
import { useMeta404, usePageMeta } from '@/lib/seo';
import { RUTAS } from '@/lib/urls';

export default function PageNotFound() {
  usePageMeta({
    titulo: 'Página no encontrada | Ser Migrantes',
    descripcion: 'La página que buscabas no existe o ha cambiado de dirección.',
    noindex: true,
  });
  useMeta404(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <section className="contenedor flex min-h-[60vh] items-center py-16 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-heading text-[4rem] font-semibold leading-none text-acento">404</p>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-secundario md:text-4xl">
          Esta página no existe (o se ha mudado).
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[1.02rem] leading-[1.7] text-texto-suave">
          No pasa nada: puede que el enlace esté mal escrito o que hayamos cambiado alguna
          dirección. Puedes seguir desde aquí.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Boton to={RUTAS.inicio}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </Boton>
          <Boton to={RUTAS.historias} variante="secundario">
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Ver historias
          </Boton>
        </div>

        <p className="mt-8 text-sm text-texto-suave">
          Si buscabas una duda concreta, quizá esté en{' '}
          <Link
            to={RUTAS.preguntas}
            className="font-medium text-primario underline decoration-acento decoration-2 underline-offset-4"
          >
            preguntas frecuentes
          </Link>
          .
        </p>
      </div>
    </section>
  );
}