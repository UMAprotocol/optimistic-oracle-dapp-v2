import { Page, Request } from "@/types";
import styled from "styled-components";
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
    <_TR>
      <TitleCell {...request} />
      {row}
      <MoreDetailsCell request={request} />
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
