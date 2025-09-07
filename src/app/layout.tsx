import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixel Pet - Virtual Pet Game",
  description: "Take care of your adorable pixel pet! Feed it, name it, and watch its mood change with cute animations.",
  keywords: ["pixel pet", "virtual pet", "game", "retro", "pixel art"],
  authors: [{ name: "Pixel Pet Game" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 min-h-screen`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 py-4">
            <div className="container mx-auto px-4">
              <h1 className="text-3xl font-bold text-white text-center pixel-font">
                🎮 Pixel Pet Game 🎮
              </h1>
              <p className="text-center text-purple-200 mt-2">
                Take care of your adorable virtual companion!
              </p>
            </div>
          </header>
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-4">
            <div className="container mx-auto px-4 text-center text-purple-200">
              <p>Made with ❤️ for pixel pet lovers</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}