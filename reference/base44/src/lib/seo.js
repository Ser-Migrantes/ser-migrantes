const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect } from 'react';

export const SITIO = 'https://sermigrantes.es';

export const IMAGEN_DEFECTO =
  'https://media.db.com/images/public/6adf86f7b399e0d3d17171c2/3271a1ce3_generated_image.png';

const IDIOMA = 'es';

function upsertMeta(atributo, clave, contenido) {
  if (!contenido) return;
  let el = document.head.querySelector(`meta[${atributo}="${clave}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(atributo, clave);
    document.head.appendChild(el);
  }
  el.setAttribute('content', contenido);
}

function upsertEnlace(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function recortar(texto, maximo) {
  const limpio = String(texto ?? '')
    .replace(/\s+/g, ' ')
    .trim();
  if (limpio.length <= maximo) return limpio;
  return `${limpio.slice(0, maximo - 1).trimEnd()}…`;
}

/**
 * Metadatos por página: título, descripción, canónica, Open Graph,
 * Twitter Card, robots y datos estructurados (JSON-LD).
 */
export function usePageMeta({
  titulo,
  descripcion,
  ruta = '/',
  imagen = IMAGEN_DEFECTO,
  jsonLd,
  noindex = false,
  tipo = 'website',
}) {
  useEffect(() => {
    document.documentElement.setAttribute('lang', IDIOMA);
    if (titulo) document.title = titulo;

    const descripcionCorta = descripcion ? recortar(descripcion, 160) : '';
    const url = `${SITIO}${ruta}`;

    if (descripcionCorta) upsertMeta('name', 'description', descripcionCorta);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertEnlace('canonical', url);

    upsertMeta('property', 'og:site_name', 'Ser Migrantes');
    upsertMeta('property', 'og:locale', 'es_ES');
    upsertMeta('property', 'og:type', tipo);
    upsertMeta('property', 'og:title', titulo);
    upsertMeta('property', 'og:description', descripcionCorta);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', imagen);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', titulo);
    upsertMeta('name', 'twitter:description', descripcionCorta);
    upsertMeta('name', 'twitter:image', imagen);
  }, [titulo, descripcion, ruta, imagen, noindex, tipo]);

  const bloques = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const firma = JSON.stringify(bloques);

  useEffect(() => {
    if (bloques.length === 0) return undefined;
    const scripts = bloques
      .filter(Boolean)
      .map((bloque) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(bloque);
        script.setAttribute('data-seo', 'json-ld');
        document.head.appendChild(script);
        return script;
      });
    return () => scripts.forEach((script) => script.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firma]);
}

export function useMeta404(activo) {
  useEffect(() => {
    if (!activo) return undefined;
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'prerender-status-code');
    meta.setAttribute('content', '404');
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, [activo]);
}