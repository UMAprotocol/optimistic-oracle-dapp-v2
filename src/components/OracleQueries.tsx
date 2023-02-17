import { hideOnMobileAndUnder, showOnMobileAndUnder } from "@/helpers";
import type { OracleQueryUI, Page } from "@/types";
import styled from "styled-components";
import { OracleQueryList } from "./OracleQueryList/OracleQueryList";
import { OracleQueryTable } from "./OracleQueryTable/OracleQueryTable";

interface Props {
  page: Page;
  queries: OracleQueryUI[];
  isLoading: boolean;
}
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
