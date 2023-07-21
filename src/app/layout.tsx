"use client";

import { ConfigWrappers } from "@/components/ConfigWrappers";
import { siteTitle } from "@/constants";

const title = siteTitle;
const description = "An optimistic oracle built for web3";
const images = "/assets/twitter-card.png";

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
