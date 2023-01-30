import { GlobalStyle } from "@/components";
import {
  infuraId,
  red500,
  supportedChains,
  walletsAndConnectors,
  white,
} from "@/constants";
import "@/styles/fonts.css";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
// import oracle from "@/helpers/oracleSdk";

// oracle && console.log("oracle client loaded");

if (typeof window !== "undefined" && window.Worker) {
  console.log("starting worker");
  const oracleWorker = new Worker("workers/oracle.worker.js");
  oracleWorker.postMessage(["hello", "world"]);
  oracleWorker.onmessage = function (e) {
    console.log(e);
  };
}

export const { chains, provider } = configureChains(supportedChains, [
  infuraProvider({ apiKey: infuraId }),
  publicProvider(),
]);

const { connectors } = walletsAndConnectors;

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const rainbowKitTheme = darkTheme({
  accentColor: red500,
  accentColorForeground: white,
  borderRadius: "small",
  overlayBlur: "small",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={rainbowKitTheme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
