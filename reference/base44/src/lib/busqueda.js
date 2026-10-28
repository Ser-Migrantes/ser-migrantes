export function normalizar(texto) {
  return String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function contiene(valor, termino) {
  const texto = Array.isArray(valor) ? valor.join(' ') : valor;
  return normalizar(texto).includes(termino);
}

export function filtrarRelatos(relatos, { q = '', casuistica = '', perfil = '' } = {}) {
  const termino = normalizar(q);
  return (relatos || []).filter((relato) => {
    if (casuistica && relato.casuistica !== casuistica) return false;
    if (perfil && relato.perfil !== perfil) return false;
    if (!termino) return true;
    return contiene(
      [relato.titulo, relato.resumen, relato.casuistica, relato.perfil, relato.etiquetas],
      termino,
    );
  });
}

export function filtrarPreguntas(preguntas, { q = '', casuistica = '', perfil = '' } = {}) {
  const termino = normalizar(q);
  return (preguntas || []).filter((pregunta) => {
    if (casuistica && pregunta.casuistica !== casuistica) return false;
    if (perfil && perfil !== '' && pregunta.perfil && pregunta.perfil !== perfil) return false;
    if (!termino) return true;
    return contiene([pregunta.pregunta, pregunta.respuesta, pregunta.casuistica, pregunta.etiquetas], termino);
  });
}