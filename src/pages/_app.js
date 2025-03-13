import localFont from "next/font/local";
import { GithubProvider } from '@/providers/Github/Github';
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import "@/styles/globals.css";

import NoSSR from "@/providers/NoSSR/NoSSR";
import useNoSSR from "@/providers/NoSSR/useNoSSR";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function App({ Component, pageProps }) {
  useNoSSR(() => {});

  return (
    <NoSSR>
      <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen min-w-[768px] font-[family-name:var(--font-geist-sans)] flex flex-col`}>
        <GithubProvider>
          <Navbar />
          <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 flex-grow">
            <Component {...pageProps} />
          </main>
          <Footer />
        </GithubProvider>
      </div>
    </NoSSR>
  );
}
