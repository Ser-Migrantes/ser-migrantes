import Divisor from '@/components/Divisor';
import Reveal from '@/components/Reveal';

export default function FranjaImpacto() {
  return (
    <section aria-label="Frase de impacto" className="mt-4">
      <Divisor tono="primario" />
      <div className="bg-primario py-12 md:py-16">
        <div className="contenedor">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-[1.7rem] font-medium leading-[1.25] text-crema sm:text-[2.1rem] md:text-[2.5rem]">
              Ser migrante es mucho más que tener papeles.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-crema/80 md:text-base">
              Es una identidad, una red de afectos y una valentía que no caduca.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}