import { GlobalStyle } from "@/components";
import type { AppProps } from "next/app";
import example from "@libs/example";

example();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
