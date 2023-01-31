import { Page, Request } from "@/types";
import { useEffect, useRef, useState } from "react";
import styled, { CSSProperties } from "styled-components";
import { useIsClient } from "usehooks-ts";
import { Headers } from "./Headers";
import { Row } from "./Row";

interface Props {
  page: Page;
  requests: Request[];
}
export function Table({ page, requests }: Props) {
  const tableRef = useRef<HTMLTableElement>(null);
  const [tableWidth, setTableWidth] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    updateTableWidth();

    window.addEventListener("resize", updateTableWidth);

    function updateTableWidth() {
      if (tableRef.current) {
        setTableWidth(tableRef.current.offsetWidth);
      }
    }

    return () => {
      window.removeEventListener("resize", updateTableWidth);
    };
  }, [isClient]);

  const style = {
    "--table-width": `${tableWidth}px`,
  } as CSSProperties;

  return (
    <Wrapper style={style}>
      <_Table ref={tableRef}>
        <Headers page={page} />
        <TBody>
          {requests.map((request) => (
            <Row key={request.id} page={page} request={request} />
          ))}
        </TBody>
      </_Table>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: var(--grey-400);
  padding-bottom: 64px;
  padding-top: 24px;
`;

const _Table = styled.table`
  width: 100%;
  max-width: var(--page-width);
  margin-inline: auto;
  border-spacing: 0 4px;
`;

const TBody = styled.tbody`
  background: var(--white);
`;
