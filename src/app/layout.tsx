import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Lembrete Eletrozone | Bloco de Notas Le Postiche",
  description: "Gerenciador de lembretes e tarefas em estilo Post-it com prioridades por cores e datas limites. Hospedado em lembrete.eletrozone.net.br",
  keywords: ["lembrete", "post-it", "le postiche", "tarefas", "eletrozone", "organizador"],
  authors: [{ name: "Eletrozone Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} dark`}>
      <body className="min-h-screen flex flex-col font-sans antialiased text-zinc-100 bg-[#09090b]">
        {children}
      </body>
    </html>
  );
}
