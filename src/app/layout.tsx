import { AuthProvider } from "@/context/authContext";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toaster";
import { ConfirmProvider } from "@/components/ui/Confirm";

export const metadata: Metadata = {
  title: "Next.js Auth Example",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <ConfirmProvider>
            <AuthProvider>{children}</AuthProvider>
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
