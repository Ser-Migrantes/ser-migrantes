import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import Boton from '@/components/Boton';
import { RUTAS } from '@/lib/urls';
import { usePageMeta } from '@/lib/seo';

const AVISO = 'Texto pendiente de revisión legal.';

const DOCUMENTOS = {
  'aviso-legal': {
    titulo: 'Aviso legal | Ser Migrantes',
    descripcion:
      'Condiciones de uso del sitio sermigrantes.es, naturaleza informativa de los contenidos y límites de responsabilidad.',
    ruta: RUTAS.avisoLegal,
    etiqueta: 'Aviso legal',
    encabezado: 'Aviso legal',
    entrada:
      'Aquí explicamos quién está detrás de este sitio, para qué sirve y qué puedes esperar de sus contenidos.',
    secciones: [
      {
        titulo: 'Titular del sitio',
        parrafos: [
          `Titular: ${AVISO} (nombre o razón social, NIF, domicilio y correo de contacto).`,
          'Este sitio se publica con el nombre Ser Migrantes y la dirección sermigrantes.es.',
        ],
      },
      {
        titulo: 'Finalidad del sitio',
        parrafos: [
          'Ser Migrantes ofrece información general, historias adaptadas y orientación inicial para personas migrantes en España.',
          'Los contenidos tienen carácter informativo y divulgativo. No constituyen asesoramiento jurídico, fiscal ni de extranjería, ni sustituyen la atención de un profesional.',
        ],
      },
      {
        titulo: 'Propiedad intelectual',
        parrafos: [
          'Los textos, ilustraciones y elementos gráficos del sitio pertenecen a Ser Migrantes o se utilizan con autorización.',
          'No está permitida su reproducción total o parcial sin citar la fuente, salvo los usos que la ley permita.',
        ],
      },
      {
        titulo: 'Responsabilidad',
        parrafos: [
          'Trabajamos para que la información esté actualizada, pero los requisitos y procedimientos administrativos cambian. Antes de tomar decisiones, confirma los datos con la administración competente o con un profesional.',
          'No nos hacemos responsables del uso que se haga de la información publicada ni del contenido de webs externas enlazadas.',
        ],
      },
      {
        titulo: 'Legislación aplicable',
        parrafos: [
          `Legislación aplicable y resolución de conflictos: ${AVISO} (por ejemplo, legislación española y jurisdicción de los tribunales correspondientes).`,
        ],
      },
    ],
  },
  privacidad: {
    titulo: 'Política de privacidad | Ser Migrantes',
    descripcion:
      'Cómo tratamos los datos que nos envías a través del formulario de contacto: finalidad, base legal, conservación y tus derechos.',
    ruta: RUTAS.privacidad,
    etiqueta: 'Privacidad',
    encabezado: 'Política de privacidad',
    entrada:
      'Tu historia es tuya. Aquí te contamos, en lenguaje claro, qué hacemos con los datos que nos escribes.',
    secciones: [
      {
        titulo: 'Responsable del tratamiento',
        parrafos: [
          `Responsable: ${AVISO} (nombre o razón social, NIF, domicilio y correo de contacto).`,
        ],
      },
      {
        titulo: 'Qué datos tratamos',
        parrafos: [
          'Los datos que incluyes voluntariamente en el formulario de contacto: nombre o alias, correo electrónico, teléfono si decides facilitarlo, el servicio sobre el que preguntas y la descripción de tu situación.',
          'No solicitamos documentación ni datos especialmente sensibles. Te pedimos que compartas solo lo necesario para poder orientarte.',
        ],
      },
      {
        titulo: 'Para qué y con qué base legal',
        parrafos: [
          'Utilizamos tus datos únicamente para leer tu consulta y responderte con información u orientación.',
          'La base legal es tu consentimiento, que otorgas al marcar la casilla del formulario y que puedes retirar en cualquier momento.',
        ],
      },
      {
        titulo: 'Cuánto tiempo los conservamos',
        parrafos: [
          `Plazo de conservación: ${AVISO} (por ejemplo, el tiempo necesario para atender tu consulta y el plazo legal aplicable).`,
        ],
      },
      {
        titulo: 'Destinatarios y derechos',
        parrafos: [
          'No cedemos tus datos a terceros ajenos a la atención de tu consulta.',
          'Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo al correo de contacto que figure en el aviso legal.',
          'Si consideras que no hemos atendido bien tus derechos, puedes reclamar ante la Agencia Española de Protección de Datos.',
        ],
      },
    ],
  },
  cookies: {
    titulo: 'Política de cookies | Ser Migrantes',
    descripcion:
      'Qué cookies usa sermigrantes.es, para qué sirven y cómo puedes configurarlas o eliminarlas desde tu navegador.',
    ruta: RUTAS.cookies,
    etiqueta: 'Cookies',
    encabezado: 'Política de cookies',
    entrada:
      'Usamos lo mínimo imprescindible para que la web funcione. Si añadimos medición de visitas, te lo pediremos antes.',
    secciones: [
      {
        titulo: 'Qué son las cookies',
        parrafos: [
          'Son pequeños archivos que se guardan en tu dispositivo cuando visitas una web y permiten recordar información sobre la navegación.',
        ],
      },
      {
        titulo: 'Cookies que usamos',
        parrafos: [
          'Cookies técnicas necesarias: permiten el funcionamiento básico del sitio y recordar tu sesión si accedes al área privada del equipo.',
          `Cookies de analítica o publicidad: ${AVISO} (indica si se activan, con qué proveedor y durante cuánto tiempo).`,
        ],
      },
      {
        titulo: 'Cómo gestionarlas',
        parrafos: [
          'Puedes bloquear o eliminar las cookies desde la configuración de tu navegador. Si desactivas las cookies técnicas, algunas partes del sitio pueden no funcionar correctamente.',
        ],
      },
    ],
  },
};

export default function Legal({ tipo = 'aviso-legal' }) {
  const documento = DOCUMENTOS[tipo] || DOCUMENTOS['aviso-legal'];

  usePageMeta({
    titulo: documento.titulo,
    descripcion: documento.descripcion,
    ruta: documento.ruta,
  });

  return (
    <>
      <section className="contenedor pb-6 pt-8 md:pt-12">
        <Breadcrumbs
          items={[{ label: 'Inicio', to: RUTAS.inicio }, { label: documento.encabezado }]}
        />
      </section>

      <section className="contenedor pb-16 md:pb-24">
        <div className="max-w-3xl">
          <p className="etiqueta text-primario">{documento.etiqueta}</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold text-secundario md:text-5xl">
            {documento.encabezado}
          </h1>
          <p className="mt-4 text-lg leading-[1.7] text-texto-suave">{documento.entrada}</p>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-acento/70 bg-acento/25 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-texto" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-texto">
              <strong className="font-semibold">Borrador pendiente de revisión legal.</strong> Este
              documento es una plantilla de trabajo: falta completar los datos del titular y validar
              el contenido con asesoramiento jurídico antes de publicar.
            </p>
          </div>

          <div className="prosa-lectura mt-10">
            {documento.secciones.map((seccion) => (
              <section key={seccion.titulo} className="mt-8 first:mt-0">
                <h2 className="font-heading text-2xl font-semibold text-secundario">
                  {seccion.titulo}
                </h2>
                {seccion.parrafos.map((parrafo) => (
                  <p key={parrafo} className="mt-3 text-[1.02rem] leading-[1.7] text-texto-suave">
                    {parrafo}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Boton to={RUTAS.contacto}>Hablar con el equipo</Boton>
            <Boton to={RUTAS.historias} variante="secundario">
              Ver historias
            </Boton>
          </div>

          <p className="mt-8 text-sm text-texto-suave">
            ¿Buscas algo más? Vuelve al{' '}
            <Link to={RUTAS.inicio} className="font-medium text-primario underline underline-offset-4">
              inicio de Ser Migrantes
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}