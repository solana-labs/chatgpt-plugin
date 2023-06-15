import Link from "next/link";
import "./globals.css";
import { Inter } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Solana Labs - ChatGPT Plugin",
  description: "Get a taste of Solana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="flex items-center p-4">
          <Link href={"/"}>
            <Image src="/solana-image.svg" width="149" height="22" alt="Solana" />
          </Link>

          <section className="">{/* add header links in here, if desired */}</section>
        </nav>

        {children}

        <footer className="my-8 text-center text-gray-400">
          &copy;
          {new Date().getFullYear()}{" "}
          <Link href="https://solanalabs.com" className="hover:underline hover:text-white">
            Solana Labs
          </Link>
          {" | "}
          <Link href="https://solanapay.com/tos" className="hover:underline hover:text-white">
            Terms of Service
          </Link>
        </footer>
      </body>
    </html>
  );
}
