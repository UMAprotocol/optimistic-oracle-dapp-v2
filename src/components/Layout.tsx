import {
  ErrorBanner,
  Filters,
  Header,
  Notifications,
  Panel,
} from "@/components";
import { siteDescription, siteTitle } from "@/constants";
import { capitalizeFirstLetter } from "@/helpers";
import { useHandleQueryInUrl, usePageContext } from "@/hooks";
import Head from "next/head";
import type { ReactNode } from "react";
import styled from "styled-components";

export function Layout({ children }: { children: ReactNode }) {
  const { page } = usePageContext();
  useHandleQueryInUrl();

  return (
    <>
      <Head>
        <title>{`${siteTitle} | ${capitalizeFirstLetter(page)}`}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <ErrorBanner />
        <Header page={page} />
        <Filters />
        {children}
        <Panel />
        <Notifications />
      </Main>
    </>
  );
}

const Main = styled.main`
  height: 100%;
`;
