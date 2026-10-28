import { generarSlug } from './slug';

export const RUTAS = {
  inicio: '/',
  historias: '/historias',
  preguntas: '/preguntas-frecuentes',
  servicios: '/servicios',
  contacto: '/contacto',
  avisoLegal: '/aviso-legal',
  privacidad: '/privacidad',
  cookies: '/cookies',
};

export function slugDeRelato(relato) {
  if (!relato) return '';
  return relato.slug?.trim() || generarSlug(relato.titulo) || relato.id;
}

export function rutaRelato(relato) {
  return `${RUTAS.historias}/${slugDeRelato(relato)}`;
}

export function coincideRelato(relato, slug) {
  if (!relato || !slug) return false;
  return relato.slug === slug || relato.id === slug || slugDeRelato(relato) === slug;
}