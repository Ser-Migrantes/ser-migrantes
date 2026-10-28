import { useEffect, useState } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';

const TELEFONO_VISIBLE = '+34 600 982 993';
const TELEFONO_TEL = '+34600982993';
const WHATSAPP = '34600982993';

export default function LlamadaFlotante() {
  const [visible, setVisible] = useState(false);
  const [abierto, setAbierto] = useState(true);

  useEffect(() => {
    const alDesplazar = () => setVisible(window.scrollY > 420);
    alDesplazar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  if (!abierto) return null;

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-40 transition-all duration-500 motion-reduce:transition-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[21.5rem] ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="relative rounded-[1.5rem] border border-secundario/15 bg-superficie p-5 pr-12 shadow-elevada">
        <button
          type="button"
          onClick={() => setAbierto(false)}
          aria-label="Cerrar el aviso de contacto"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-texto-suave transition-colors hover:bg-superficie-suave hover:text-secundario"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="etiqueta text-primario">Estamos al otro lado</p>
        <p className="mt-2 font-heading text-[1.35rem] font-semibold leading-snug text-secundario">
          Llámanos o escríbenos al {TELEFONO_VISIBLE}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`tel:${TELEFONO_TEL}`}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primario px-5 text-sm font-semibold text-crema transition-colors hover:bg-secundario"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Llamar
          </a>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-secundario/25 px-5 text-sm font-semibold text-secundario transition-colors hover:bg-superficie-suave"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}