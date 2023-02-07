import { Button } from "@/components";
import { usePanelContext } from "@/hooks";
import { OracleQueryUI, Page } from "@/types";
import { TD } from "./style";

export function MoreDetailsCell({
  row,
  page,
}: {
  row: OracleQueryUI;
  page: Page;
}) {
  const { openPanel } = usePanelContext();

  function onClick() {
    openPanel(row, page);
  }

  return (
    <TD>
      <Button onClick={onClick}>More details</Button>
    </TD>
  );
}
