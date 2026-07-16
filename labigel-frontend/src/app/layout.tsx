import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Labigel Cafe | Dijital Menü",
  description: "Labigel Cafe dijital menüsü. Ye, İç, Oyna!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center" 
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#fff',
                border: '1px solid #333',
              },
              success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
              error: { iconTheme: { primary: '#E31E24', secondary: '#fff' } },
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
