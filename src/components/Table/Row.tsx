import { Page, Request } from "@/types";
import { MoreDetailsCell } from "./MoreDetailsCell";
import { ProposeRow } from "./ProposeRow";
import { SettledRow } from "./SettledRow";
import { TR } from "./style";
import { TitleCell } from "./TitleCell";
import { VerifyRow } from "./VerifyRow";

export function Row({ page, request }: { page: Page; request: Request }) {
  const rows = {
    verify: <VerifyRow {...request} />,
    propose: <ProposeRow {...request} />,
    settled: <SettledRow {...request} />,
  };

  const row = rows[page];

  return (
    <TR>
      <TitleCell {...request} />
      {row}
      <MoreDetailsCell request={request} />
    </TR>
  );
}
