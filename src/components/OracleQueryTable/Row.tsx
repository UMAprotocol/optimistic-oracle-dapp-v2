import { OracleQueryClickableIcon } from "@/components/style";
import { usePanelContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { ProposeCells } from "./ProposeCells";
import { SettledCells } from "./SettledCells";
import { TD, TR } from "./style";
import { TitleCell } from "./TitleCell";
import { VerifyCells } from "./VerifyCells";
import { useCustomBond } from "@/hooks/useCustomBond";

/**
 * Row for the table
 * This is shown when the data is loaded
 * @param page - the page of the app, used to determine which columns to show
 * @param row - the row to show
 */
export function Row({
  page,
  row: query,
}: {
  page: PageName;
  row: OracleQueryUI;
}) {
  const customBondData = useCustomBond({
    query,
  });

  const row: OracleQueryUI = {
    ...query,
    tokenAddress: customBondData?.data?.currency ?? query.tokenAddress,
    bond: customBondData?.data?.bond ?? query.bond,
  };
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
