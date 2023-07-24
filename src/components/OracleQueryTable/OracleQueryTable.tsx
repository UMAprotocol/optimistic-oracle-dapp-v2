import { Pagination, usePagination } from "@/components";
import { defaultResultsPerPage } from "@/constants";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { castDraft, type Immutable } from "immer";
import styled from "styled-components";
import { Headers } from "./Headers";
import { LoadingRow } from "./LoadingRow";
import { Row } from "./Row";

type Props = Immutable<{
  page: PageName;
  rows: OracleQueryUI[];
  isLoading: boolean;
  findQueryIndex?: number | undefined;
}>;
/**
 * Table for showing oracle queries.
 * Intended to be shown on desktop.
 * @param page - the page of the app, used to determine which columns to show
 * @param rows - the rows to show in the table
 * @param isLoading - whether the table is loading
 * @param findQueryIndex - the index of the query from the url, if any
 */
export function OracleQueryTable({
  page,
  rows,
  isLoading,
  findQueryIndex,
}: Props) {
  const { entriesToShow, ...paginationProps } = usePagination(
    castDraft(rows),
    findQueryIndex,
  );

  return (
    <Wrapper>
      <_Table>
        <Headers page={page} />
        <TBody>
          {/* When the data is still loading, we show 4 dummy rows with loading skeletons */}
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingRow key={i} page={page} />
              ))}
            </>
          ) : (
            <>
              {entriesToShow.map((row) => (
                <Row key={row.id} page={page} row={row} />
              ))}
            </>
          )}
        </TBody>
      </_Table>
      {rows.length > defaultResultsPerPage && !isLoading && (
        <PaginationWrapper>
          <Pagination {...paginationProps} />
        </PaginationWrapper>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: var(--grey-400);
  padding-bottom: 64px;
  padding-top: 24px;
`;

const _Table = styled.table`
  --gap: clamp(8px, 1.5vw, 20px);
  width: 100%;
  max-width: var(--page-width);
  margin-inline: auto;
  border-spacing: 0 4px;
`;

const TBody = styled.tbody`
  background: var(--white);
`;

const PaginationWrapper = styled.div`
  max-width: var(--page-width);
  margin-top: 32px;
  margin-inline: auto;
`;
