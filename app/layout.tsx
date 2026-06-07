import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI/LLM 기술 블로그",
  description: "LLM 애플리케이션 개발·에이전트·RAG·운영 노하우",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-colors">
              AI/LLM 기술 블로그
            </a>
            <nav className="text-sm text-gray-500">
              <a href="/" className="hover:text-gray-900 transition-colors">
                글 목록
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
            Powered by Notion CMS + Next.js
          </div>
        </footer>
      </body>
    </html>
  );
}
