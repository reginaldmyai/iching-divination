import './globals.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: '易經卜卦 | I Ching Divination',
  description: '線上易經卜卦平台 — 模擬傳統擲銅錢起卦，即時取得卦象與專業解讀。',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>
        <Header />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
