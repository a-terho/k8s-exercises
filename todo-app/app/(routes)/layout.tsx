import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'todo app',
  description: 'Next generation todo app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <h1 className="flex place-content-center">Todo App</h1>
        {children}
      </body>
    </html>
  );
}
