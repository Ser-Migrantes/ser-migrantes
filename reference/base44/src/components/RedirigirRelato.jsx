import { Navigate, useParams } from 'react-router-dom';

/**
 * Rutas antiguas (/relatos/:slug) → nueva ruta (/historias/:slug),
 * conservando el slug para no romper enlaces compartidos.
 */
export default function RedirigirRelato() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/historias/${slug}` : '/historias'} replace />;
}