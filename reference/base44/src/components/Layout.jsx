import { Outlet } from 'react-router-dom';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import LlamadaFlotante from './LlamadaFlotante';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-fondo">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primario focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-crema"
      >
        Saltar al contenido principal
      </a>
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      <LlamadaFlotante />
    </div>
  );
}