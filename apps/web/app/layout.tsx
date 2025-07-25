import { Inter } from 'next/font/google';
import { ThemeRegistry } from '@/components/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Product Management',
  description: 'Manage your product list with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ width: '100%', height: '100%' }}>
      <body
        className={inter.className}
        style={{
          width: '100%',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          backgroundColor: '#f9f9f9', // optional
        }}
      >
        <ThemeRegistry>
          <main style={{ width: '100%' }}>{children}</main>
        </ThemeRegistry>
      </body>
    </html>
  );
}
