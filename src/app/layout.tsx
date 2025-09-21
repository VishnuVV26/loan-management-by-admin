import { AuthProvider } from "@/context/authContext";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toaster";
import { ConfirmProvider } from "@/components/ui/Confirm";
import "./globals.css";
import { Poppins } from "next/font/google";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Loan Management admin",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans bg-app text-foreground`}>
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
