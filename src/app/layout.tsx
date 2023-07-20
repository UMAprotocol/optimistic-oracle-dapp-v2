import { Layout } from "@/components";
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry";
import { siteTitle } from "@/constants";
import type { Metadata } from "next";

const title = siteTitle;
const description = "An optimistic oracle built for web3";
const images = "/assets/twitter-card.png";
export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: ["/favicon-32x32.png", "/favicon-16x16.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@UMAprotocol",
    title,
    images,
  },
  openGraph: {
    title,
    description,
    images,
    url: "https://oracle.uma.xyz",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Layout>{children}</Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
