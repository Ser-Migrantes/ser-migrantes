export const ESTILO_INPUT =
  'w-full rounded-xl border border-verde/25 bg-crema px-3 py-2 text-sm text-tinta focus:border-turquesa focus:outline-none';

export const ESTILO_TARJETA = 'rounded-[1.5rem] border border-verde/15 bg-crema-alta p-5 md:p-6';

export default function Campo({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-verde/80">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}