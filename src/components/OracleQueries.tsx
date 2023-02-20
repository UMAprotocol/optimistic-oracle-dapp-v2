import { OracleQueryList, OracleQueryTable } from "@/components";
import { hideOnMobileAndUnder, showOnMobileAndUnder } from "@/helpers";
import type { OracleQueryUI, Page } from "@/types";
import styled from "styled-components";

interface Props {
  page: Page;
  queries: OracleQueryUI[];
  isLoading: boolean;
}
/**
 * Renders a list or a table of oracle queries.
 * Shows a list on mobile and a table on desktop.
 * @param page The page the queries are being rendered on.
 * @param queries The queries to render.
 * @param isLoading Whether the queries are still loading.
 */
export function OracleQueries({ page, queries, isLoading }: Props) {
  return (
    <>
      <DesktopWrapper>
        <OracleQueryTable page={page} rows={queries} isLoading={isLoading} />
      </DesktopWrapper>
      <MobileWrapper>
        <OracleQueryList page={page} items={queries} isLoading={isLoading} />
      </MobileWrapper>
    </>
  );
}

const DesktopWrapper = styled.div`
  ${hideOnMobileAndUnder}
`;

const MobileWrapper = styled.div`
  ${showOnMobileAndUnder}
`;
