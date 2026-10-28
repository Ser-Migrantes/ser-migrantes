import { useEffect, useRef, useState } from 'react';

/**
 * Aparición gradual al entrar en pantalla.
 * Con "reducir movimiento" activado, el contenido se ve directamente.
 */
export default function Reveal({
  as: Etiqueta = 'div',
  delay = 0,
  className = '',
  children,
  ...resto
}) {
  const referencia = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <Etiqueta
      ref={referencia}
      style={{ transitionDelay: `${delay}ms` }}
      className={`revelar ${visible ? 'revelar-visible' : ''} ${className}`}
      {...resto}
    >
      {children}
    </Etiqueta>
  );
}