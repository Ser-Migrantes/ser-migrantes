import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeR MigranteS",
  description:
    "Acompañamos a personas migrantes en España con relatos, respuestas claras y servicios de confianza.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
