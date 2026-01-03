import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import AuthPopup from "@/components/AuthPopup";

export const metadata: Metadata = {
  title: "CineVault",
  description: "Discover your next favorite movie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <ToastProvider>
          <AuthProvider>
            <Navbar />
            {children}
            <AuthPopup />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
