import { useEffect } from 'react';
import Hero from '@/components/home/Hero';
import FranjaImpacto from '@/components/home/FranjaImpacto';
import Acompanamiento from '@/components/home/Acompanamiento';
import HistoriasDestacadas from '@/components/home/HistoriasDestacadas';
import PreguntasDestacadas from '@/components/home/PreguntasDestacadas';
import ServiciosDestacados from '@/components/home/ServiciosDestacados';
import CierreContacto from '@/components/home/CierreContacto';
import useContenidoPublico from '@/hooks/useContenidoPublico';
import { registrarEvento } from '@/lib/eventos';
import { IMAGEN_DEFECTO, SITIO, usePageMeta } from '@/lib/seo';

const ORGANIZACION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ser Migrantes',
  alternateName: 'sermigrantes.es',
  url: SITIO,
  logo: IMAGEN_DEFECTO,
  description:
    'Plataforma de historias, preguntas frecuentes y acompañamiento para personas migrantes en España.',
  areaServed: { '@type': 'Country', name: 'España' },
  knowsLanguage: 'es-ES',
};

const SITIO_WEB = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Ser Migrantes',
  url: SITIO,
  inLanguage: 'es-ES',
  description:
    'Historias de migrantes en España, respuestas claras sobre trámites de extranjería y servicios de acompañamiento.',
};

export default function Home() {
  usePageMeta({
    titulo: 'Ser Migrantes | Historias y apoyo para migrantes en España',
    descripcion:
      'Historias reales de personas migrantes en España, respuestas claras sobre regularización y arraigo, y acompañamiento para tu siguiente paso.',
    ruta: '/',
    jsonLd: [ORGANIZACION, SITIO_WEB],
  });

  const { relatos, preguntas, servicios } = useContenidoPublico();

  useEffect(() => {
    registrarEvento({ tipo: 'visita', referencia: 'inicio' });
  }, []);

  return (
    <>
      <Hero relatos={relatos} preguntas={preguntas} />
      <FranjaImpacto />
      <Acompanamiento />
      <HistoriasDestacadas relatos={relatos.slice(0, 3)} />
      <PreguntasDestacadas preguntas={preguntas.slice(0, 5)} relatos={relatos} />
      <ServiciosDestacados servicios={servicios.slice(0, 3)} />
      <CierreContacto />
    </>
  );
}