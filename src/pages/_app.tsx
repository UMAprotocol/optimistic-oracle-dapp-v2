import { GlobalStyle } from "@/components";
import type { AppProps } from "next/app";
import oracle from "@/helpers/oracleSdk";

oracle && console.log("oracle client loaded");

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
