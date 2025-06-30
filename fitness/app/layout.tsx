'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from "react-hot-toast";
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <SessionProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
