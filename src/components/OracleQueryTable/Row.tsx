import { OracleQueryClickableIcon } from "@/components/style";
import { usePanelContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { ProposeCells } from "./ProposeCells";
import { SettledCells } from "./SettledCells";
import { TD, TR } from "./style";
import { TitleCell } from "./TitleCell";
import { VerifyCells } from "./VerifyCells";

/**
 * Row for the table
 * This is shown when the data is loaded
 * @param page - the page of the app, used to determine which columns to show
 * @param row - the row to show
 */
export function Row({ page, row }: { page: PageName; row: OracleQueryUI }) {
  const { openPanel } = usePanelContext();
  const innerCells = {
    verify: <VerifyCells {...row} />,
    propose: <ProposeCells query={row} />,
    settled: <SettledCells {...row} />,
  };

  const innerCellsComponent = innerCells[page];

  return (
    <TR onClick={() => void openPanel(row.id)}>
      <TitleCell {...row} />
      {innerCellsComponent}
      <TD>
        <OracleQueryClickableIcon />
      </TD>
    </TR>
  );
}
