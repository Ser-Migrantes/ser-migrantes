import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { SITIO } from '@/lib/seo';

export default function Breadcrumbs({ items = [], className = '' }) {
  if (items.length === 0) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: item.label,
      ...(item.to ? { item: `${SITIO}${item.to}` } : {}),
    })),
  };

  return (
    <nav aria-label="Migas de pan" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-texto-suave">
        {items.map((item, indice) => {
          const ultimo = indice === items.length - 1;
          return (
            <li key={`${item.label}-${indice}`} className="flex items-center gap-1.5">
              {item.to && !ultimo ? (
                <Link
                  to={item.to}
                  className="rounded transition-colors hover:text-primario hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={ultimo ? 'page' : undefined} className="text-texto">
                  {item.label}
                </span>
              )}
              {!ultimo && <ChevronRight className="h-3.5 w-3.5 text-texto-suave/60" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}