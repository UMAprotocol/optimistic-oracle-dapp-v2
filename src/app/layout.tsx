"use client";

import { ConfigWrappers } from "@/components/ConfigWrappers";

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
