import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitLens AI • AI-Powered Nutrition, Calorie & Health Intelligence",
  description:
    "Track daily nutrition, macros, hydration, workouts, fasting, and body progress using intelligent multi-model AI vision recognition and personal coaching.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen selection:bg-fitness-green selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
