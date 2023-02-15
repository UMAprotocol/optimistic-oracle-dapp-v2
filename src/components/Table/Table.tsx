import { defaultResultsPerPage } from "@/constants";
import { OracleQueryUI, Page } from "@/types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Pagination } from "../Pagination";
import { Headers } from "./Headers";
import { LoadingRow } from "./LoadingRow";
import { Row } from "./Row";

interface Props {
  page: Page;
  rows: OracleQueryUI[];
  isLoading: boolean;
}
/**
 * Table for showing oracle queries
 * @param page - the page of the app, used to determine which columns to show
 * @param rows - the rows to show in the table
 * @param isLoading - whether the table is loading
 */
export function Table({ page, rows, isLoading }: Props) {
  const [rowsToShow, setRowsToShow] = useState(rows);

  useEffect(() => {
    if (rows.length <= defaultResultsPerPage) {
      setRowsToShow(rows);
    }
  }, [rows]);

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
              {rowsToShow.map((row) => (
                <Row key={row.id} page={page} row={row} />
              ))}
            </>
          )}
        </TBody>
      </_Table>
      {rows.length > defaultResultsPerPage && !isLoading && (
        <PaginationWrapper>
          <Pagination entries={rows} setEntriesToShow={setRowsToShow} />
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
