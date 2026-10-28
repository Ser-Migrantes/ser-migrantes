/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        suave: '0 2px 4px -2px rgba(26, 28, 9, 0.06), 0 12px 28px -20px rgba(26, 28, 9, 0.25)',
        elevada: '0 6px 12px -6px rgba(26, 28, 9, 0.08), 0 28px 56px -34px rgba(26, 28, 9, 0.4)',
        flotante: '0 30px 70px -45px rgba(26, 28, 9, 0.55)',
      },
      maxWidth: {
        lectura: '68ch',
      },
      colors: {
        /* marca */
        crema: 'hsl(var(--crema))',
        'crema-alta': 'hsl(var(--crema-alta))',
        turquesa: 'hsl(var(--turquesa))',
        verde: 'hsl(var(--secundario))', /* alias heredado: sin verde en la paleta */
        mostaza: 'hsl(var(--mostaza))',
        tinta: 'hsl(var(--tinta))',
        /* semánticos */
        fondo: 'hsl(var(--fondo))',
        superficie: 'hsl(var(--superficie))',
        'superficie-suave': 'hsl(var(--superficie-suave))',
        primario: 'hsl(var(--primario))',
        'primario-suave': 'hsl(var(--primario-suave))',
        secundario: 'hsl(var(--secundario))',
        acento: 'hsl(var(--acento))',
        texto: 'hsl(var(--texto))',
        'texto-suave': 'hsl(var(--texto-suave))',
        /* shadcn */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        subir: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        subir: 'subir 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
