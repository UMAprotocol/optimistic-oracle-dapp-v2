import { NoQueries, OracleQueryList, OracleQueryTable } from "@/components";
import { hideOnMobileAndUnder, showOnMobileAndUnder } from "@/helpers";
import { useFilterAndSearchContext } from "@/hooks";
import type { PageName } from "@shared/types";
import { findIndex } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTimeout } from "usehooks-ts";

interface Props {
  page: PageName;
}

export function OracleQueries({ page }: Props) {
  const { results: queries } = useFilterAndSearchContext();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const hasQueryUrl = Object.keys(router.query).length > 0;
  const findQueryIndex = hasQueryUrl
    ? findIndex(queries, router.query)
    : undefined;

  useEffect(() => {
    if (queries.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [queries]);

  useTimeout(() => {
    if (queries !== undefined) {
      setIsLoading(false);
    }
  }, 3000);

  const listProps = {
    page,
    items: queries,
    rows: queries,
    isLoading,
    findQueryIndex,
  };

  const hasNoQueries = !isLoading && queries.length === 0;

  return (
    <>
      {hasNoQueries ? (
        <NoQueries page={page} />
      ) : (
        <>
          <DesktopWrapper>
            <OracleQueryTable {...listProps} />
          </DesktopWrapper>
          <MobileWrapper>
            <OracleQueryList {...listProps} />
          </MobileWrapper>
        </>
      )}
    </>
  );
}

const DesktopWrapper = styled.div`
  ${hideOnMobileAndUnder}
`;

const MobileWrapper = styled.div`
  ${showOnMobileAndUnder}
`;
