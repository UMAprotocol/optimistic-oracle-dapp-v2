import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optimistic Oracle | UMA",
  description: "This webpage has been deprecated.",
  icons: {
    icon: ["/favicon-32x32.png", "/favicon-16x16.png"],
  },
  robots: { index: false, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          color: "#272528",
          background: "#ffffff",
        }}
      >
        {children}
      </body>
    </html>
  );
}
