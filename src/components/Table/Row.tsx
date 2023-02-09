import { usePanelContext } from "@/hooks";
import { OracleQueryUI, Page } from "@/types";
import { ProposeCells } from "./ProposeCells";
import { SettledCells } from "./SettledCells";
import { ClickableIcon, TD, TR } from "./style";
import { TitleCell } from "./TitleCell";
import { VerifyCells } from "./VerifyCells";

export function Row({ page, row }: { page: Page; row: OracleQueryUI }) {
  const { openPanel } = usePanelContext();

  const innerCells = {
    verify: <VerifyCells {...row} />,
    propose: <ProposeCells {...row} />,
    settled: <SettledCells {...row} />,
  };

  const innerCellsComponent = innerCells[page];

  function onClick() {
    openPanel(row, page);
  }

  return (
    <TR onClick={onClick}>
      <TitleCell {...row} />
      {innerCellsComponent}
      <TD>
        <ClickableIcon />
      </TD>
    </TR>
  );
}
