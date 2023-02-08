import { usePanelContext } from "@/hooks";
import { OracleQueryUI, Page } from "@/types";
import Clickable from "public/assets/icons/clickable.svg";
import styled from "styled-components";
import { ProposeCells } from "./ProposeCells";
import { SettledCells } from "./SettledCells";
import { TD, TR } from "./style";
import { TitleCell } from "./TitleCell";
import { VerifyCells } from "./VerifyCells";

export function Row({ page, row }: { page: Page; row: OracleQueryUI }) {
  const { openPanel } = usePanelContext();

  const rows = {
    verify: <VerifyCells {...row} />,
    propose: <ProposeCells {...row} />,
    settled: <SettledCells {...row} />,
  };

  const rowComponent = rows[page];

  function onClick() {
    openPanel(row, page);
  }

  return (
    <_TR onClick={onClick}>
      <TitleCell {...row} />
      {rowComponent}
      <TD>
        <ClickableIcon />
      </TD>
    </_TR>
  );
}

const ClickableIcon = styled(Clickable)`
  transition: fill var(--animation-duration);

  path {
    transition: stroke var(--animation-duration);
  }
`;

const _TR = styled(TR)`
  height: 80px;
  border-radius: 4px;
  cursor: pointer;

  & :first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  & :last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:hover {
    h3 {
      color: var(--red-500);
    }

    ${ClickableIcon} {
      fill: var(--red-500);

      path {
        stroke: var(--white);
      }
    }
  }
`;
