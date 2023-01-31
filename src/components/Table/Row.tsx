import { Page, Request } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useIsClient } from "usehooks-ts";
import { MoreDetailsCell } from "./MoreDetailsCell";
import { ProposeRow } from "./ProposeRow";
import { SettledRow } from "./SettledRow";
import { TR } from "./style";
import { TitleCell } from "./TitleCell";
import { VerifyRow } from "./VerifyRow";

export function Row({ page, request }: { page: Page; request: Request }) {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [rowWidth, setRowWidth] = useState(0);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    handleUpdateRowWidth();

    window.addEventListener("resize", handleUpdateRowWidth);

    function handleUpdateRowWidth() {
      if (rowRef.current) {
        setRowWidth(rowRef.current.offsetWidth);
      }
    }

    return () => {
      window.removeEventListener("resize", handleUpdateRowWidth);
    };
  }, [isClient]);

  const rows = {
    verify: <VerifyRow {...request} />,
    propose: <ProposeRow {...request} />,
    settled: <SettledRow {...request} />,
  };

  const row = rows[page];

  return (
    <TR ref={rowRef}>
      <TitleCell {...request} rowWidth={rowWidth} />
      {row}
      <MoreDetailsCell request={request} />
    </TR>
  );
}
