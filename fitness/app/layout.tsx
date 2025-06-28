'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <SessionProvider>
          <ToastContainer position="top-right" autoClose={2500} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
