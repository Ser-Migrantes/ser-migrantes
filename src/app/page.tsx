import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
      <Image
        src="/logo.png"
        alt="Logotipo de SeR MigranteS"
        width={160}
        height={160}
        priority
      />
      <h1 className="text-3xl font-semibold">SeR MigranteS</h1>
    </main>
  );
}
