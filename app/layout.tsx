import type { Metadata } from 'next';
import { Inter, Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'EventCraft - Ultra-Luxury & Precision Event Planning Command Center',
  description:
    'Deeply architectural, real-world Indian event planning: Verified venues, real vendor contacts, INR budget rebalancing, and live day-of execution run-of-show.',
  keywords: [
    'Indian wedding planner',
    'Event planner AI',
    'Ganesh Utsav planning',
    'Indian birthday party',
    'Wedding budget calculator INR',
    'EventCraft',
    'MeetCraft event command center',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background text-foreground">
      <body className={`${inter.variable} ${outfit.variable} ${playfair.variable} font-sans min-h-screen bg-background text-foreground bg-festive-gradient selection:bg-accent/30 selection:text-primary`}>
        {children}
      </body>
    </html>
  );
}
