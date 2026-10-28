import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { usePageMeta } from '@/lib/seo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminResumen from '@/components/admin/AdminResumen';
import AdminRelatos from '@/components/admin/AdminRelatos';
import AdminPreguntas from '@/components/admin/AdminPreguntas';
import AdminServicios from '@/components/admin/AdminServicios';
import AdminSolicitudes from '@/components/admin/AdminSolicitudes';

export default function Admin() {
  const { user } = useAuth();

  usePageMeta({
    titulo: 'Panel del equipo | Ser Migrantes',
    descripcion: 'Área privada para gestionar contenidos y solicitudes de Ser Migrantes.',
    ruta: '/admin',
    noindex: true,
  });

  if (user?.role !== 'admin') {
    return (
      <section className="contenedor py-20">
        <p className="etiqueta text-verde/70">Acceso restringido</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-verde md:text-4xl">
          Esta zona es solo para el equipo.
        </h1>
        <p className="mt-3 max-w-lg text-[0.98rem] text-tinta/75">
          Tu cuenta no tiene permisos de administración. Si crees que es un error, pide acceso a la
          persona responsable de Ser Migrantes.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primario px-5 py-2.5 text-sm font-medium text-crema-alta"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>
      </section>
    );
  }

  return (
    <section className="contenedor py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiqueta text-verde/70">Panel del equipo</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-verde md:text-4xl">
            Contenido y solicitudes
          </h1>
          <p className="mt-2 text-sm text-tinta/75">
            Publica relatos y preguntas, gestiona servicios y revisa lo que llega por el formulario.
          </p>
        </div>
        <Link to="/" className="text-sm font-medium text-verde underline underline-offset-4">
          Ver la web pública
        </Link>
      </div>

      <Tabs defaultValue="resumen" className="mt-8">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-full bg-crema-alta p-1.5">
          <TabsTrigger value="resumen" className="rounded-full px-4 py-2 text-xs">Resumen</TabsTrigger>
          <TabsTrigger value="relatos" className="rounded-full px-4 py-2 text-xs">Relatos</TabsTrigger>
          <TabsTrigger value="preguntas" className="rounded-full px-4 py-2 text-xs">Preguntas</TabsTrigger>
          <TabsTrigger value="servicios" className="rounded-full px-4 py-2 text-xs">Servicios</TabsTrigger>
          <TabsTrigger value="solicitudes" className="rounded-full px-4 py-2 text-xs">Solicitudes</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="mt-6">
          <AdminResumen />
        </TabsContent>
        <TabsContent value="relatos" className="mt-6">
          <AdminRelatos />
        </TabsContent>
        <TabsContent value="preguntas" className="mt-6">
          <AdminPreguntas />
        </TabsContent>
        <TabsContent value="servicios" className="mt-6">
          <AdminServicios />
        </TabsContent>
        <TabsContent value="solicitudes" className="mt-6">
          <AdminSolicitudes />
        </TabsContent>
      </Tabs>
    </section>
  );
}