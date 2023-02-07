import { OracleQueryUI, Page } from "@/types";
import styled from "styled-components";
import { MoreDetailsCell } from "./MoreDetailsCell";
import { ProposeCells } from "./ProposeCells";
import { SettledCells } from "./SettledCells";
import { TR } from "./style";
import { TitleCell } from "./TitleCell";
import { VerifyCells } from "./VerifyCells";

export function Row({ page, row }: { page: Page; row: OracleQueryUI }) {
  const rows = {
    verify: <VerifyCells {...row} />,
    propose: <ProposeCells {...row} />,
    settled: <SettledCells {...row} />,
  };

  const rowComponent = rows[page];

  return (
    <_TR>
      <TitleCell {...row} />
      {rowComponent}
      <MoreDetailsCell row={row} page={page} />
    </_TR>
  );
}

const _TR = styled(TR)`
  height: 80px;
  border-radius: 4px;

  & :first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  & :last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;
