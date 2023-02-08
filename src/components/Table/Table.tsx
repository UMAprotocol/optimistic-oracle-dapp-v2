import { OracleQueryUI, Page } from "@/types";
import styled from "styled-components";
import { Headers } from "./Headers";
import { Row } from "./Row";

interface Props {
  page: Page;
  rows: OracleQueryUI[];
}
export function Table({ page, rows }: Props) {
  return (
    <Wrapper>
      <_Table>
        <Headers page={page} />
        <TBody>
          {rows.map((row) => (
            <Row key={row.id} page={page} row={row} />
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
  --gap: clamp(8px, 1.5vw, 20px);
  width: 100%;
  max-width: var(--page-width);
  margin-inline: auto;
  border-spacing: 0 4px;
`;

const TBody = styled.tbody`
  background: var(--white);
`;
