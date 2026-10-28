import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'EventCraft - GenAI Event Planning Assistant for Indian Celebrations',
  description:
    'Plan Indian weddings, birthdays, and community festivals with INR budgets, backward-calculated timelines, authentic vendor checklists, and bespoke regional ideas.',
  keywords: [
    'Indian wedding planner',
    'Event planner AI',
    'Ganesh Utsav planning',
    'Indian birthday party',
    'Wedding budget calculator INR',
    'EventCraft',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background text-foreground">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-background text-foreground bg-festive-gradient`}>
        {children}
      </body>
    </html>
  );
}
