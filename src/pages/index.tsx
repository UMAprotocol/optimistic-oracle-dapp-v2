import { Layout } from "@/components";
import { siteDescription, siteTitle } from "@/constants";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>rest of page</Layout>
    </>
  );
}
