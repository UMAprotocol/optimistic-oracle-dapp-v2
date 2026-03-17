"use client";

import { Layout } from "./Layout";
import { Providers } from "./Providers";

export function ConfigWrappers({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Layout>{children}</Layout>
    </Providers>
  );
}
