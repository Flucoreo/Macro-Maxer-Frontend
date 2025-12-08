import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Noto_Sans } from 'next/font/google';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],
  display: 'swap',
  variable: '--font-noto',
});

export const metadata = {
  title: "Macro Maxer",
  description: "Personalized nutrition optimization with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={notoSans.variable}>
      <body>
        <AppRouterCacheProvider>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
