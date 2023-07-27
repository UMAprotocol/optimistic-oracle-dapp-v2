import Verify from "@/components/pages/verify";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optimistic Oracle V2 | Verify",
  description: "An optimistic oracle built for web3",
  icons: {
    icon: ["/favicon-32x32.png", "/favicon-16x16.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@UMAprotocol",
    title: "Optimistic Oracle V2 | UMA",
    images: "/assets/twitter-card.png",
  },
  openGraph: {
    title: "Optimistic Oracle V2 | UMA",
    description: "An optimistic oracle built for web3",
    images: "/assets/twitter-card.png",
    url: "https://oracle.uma.xyz",
  },
};

export default function VerifyPage() {
  return <Verify />;
}
