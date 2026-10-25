import type { Metadata, Viewport } from 'next';
import { Itim, Mali } from 'next/font/google';
import './globals.css';

const itim = Itim({
  weight: '400',
  subsets: ['latin', 'thai'],
  variable: '--font-itim',
  display: 'swap',
});

const mali = Mali({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-mali',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ชื่อร้าน · ดูดวงไพ่ทาโรต์ สวนแอปเปิ้ล',
  description: 'เว็บดูดวงไพ่ทาโรต์ ธีมสวนแอปเปิ้ล น่ารัก อบอุ่น สไตล์ Kawaii Cottagecore สั่งซื้อแพ็กเกจดูดวง ตรวจสอบสลิป และติดตามคิวคำทำนาย',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2d6a4f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${itim.variable} ${mali.variable}`}>
      <body className="antialiased min-h-screen relative select-none">
        {children}
      </body>
    </html>
  );
}
