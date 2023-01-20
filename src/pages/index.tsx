import { siteDescription, siteTitle } from "@/constants";
import Head from "next/head";
import Logo from "public/assets/logo.svg";

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Logo />
    </>
  );
}
