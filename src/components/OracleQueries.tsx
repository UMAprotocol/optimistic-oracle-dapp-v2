import { OracleQueryList, OracleQueryTable } from "@/components";
import { hideOnMobileAndUnder, showOnMobileAndUnder } from "@/helpers";
import { usePage } from "@/hooks";
import type { PageName } from "@shared/types";
import styled from "styled-components";

interface Props {
  page: PageName;
}

export function OracleQueries({ page }: Props) {
  const { results: queries, isLoading } = usePage(page);
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
