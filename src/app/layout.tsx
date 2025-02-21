import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Task Manager",
  description: "Manage task quickly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="w-[90%] bg-white"
      >
        {children}
      </body>
    </html>
  );
}
