"use client";

import { Layout } from "./Layout";
import { Providers } from "./Providers";
import { WalletConfig } from "./WalletConfig";

export function ConfigWrappers({ children }: { children: React.ReactNode }) {
  return (
    <WalletConfig>
      <Providers>
        <Layout>{children}</Layout>
      </Providers>
    </WalletConfig>
  );
}
