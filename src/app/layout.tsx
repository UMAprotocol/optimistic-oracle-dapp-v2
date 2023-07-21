"use client";

import { ConfigWrappers } from "@/components/ConfigWrappers";
import "@/styles/fonts.css";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfigWrappers>{children}</ConfigWrappers>
      </body>
    </html>
  );
}
