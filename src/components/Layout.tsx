import { Filters, Header, Panel } from "@/components";
import { siteDescription, siteTitle } from "@/constants";
import { capitalizeFirstLetter, determinePage } from "@/helpers";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import styled from "styled-components";

export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = router?.pathname;
  const page = determinePage(pathname);

  return (
    <>
      <Head>
        <title>{`${siteTitle} | ${capitalizeFirstLetter(page)}`}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Header page={page} />
        <Filters />
        {children}
      </Main>
      <Panel />
    </>
  );
}

const Main = styled.main`
  height: 100%;
`;
