import { Page, Request } from "@/types";
import { CSSProperties, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useIsClient } from "usehooks-ts";
import { Button } from "../Button";

interface Props {
  page: Page;
  requests: Request[];
}
export function Table({ page, requests }: Props) {
  return (
    <Wrapper>
      <Headers page={page} />
      <TBody>
        {requests.map((request) => (
          <Row key={request.id} page={page} request={request} />
        ))}
      </TBody>
    </Wrapper>
  );
}

function Headers({ page }: { page: Page }) {
  const verify = [
    "Query/Statement",
    "Proposal/Assertion",
    "Challenge period left",
  ];

  const propose = ["Query/Statement", "Type", "Bond", "Reward"];

  const settled = ["Query/Statement", "Type", "Settled as"];

  const headersForPages = {
    verify,
    propose,
    settled,
  };

  const headers = headersForPages[page];

  return (
    <THead>
      <TR>
        {headers.map((header) => (
          <TH key={header} scope="col">
            {header}
          </TH>
        ))}
      </TR>
    </THead>
  );
}

function Row({ page, request }: { page: Page; request: Request }) {
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

function TitleCell({
  title,
  project,
  chain,
  time,
  rowWidth,
}: Request & { rowWidth: number }) {
  const width = rowWidth * 0.45;
  const style = {
    "--width": `${width}px`,
  } as CSSProperties;

  return (
    <TitleTD style={style}>
      <TitleWrapper>
        {title}
        {project}
        {chain}
        {time.toString()}
      </TitleWrapper>
    </TitleTD>
  );
}

function MoreDetailsCell({ request }: { request: Request }) {
  return (
    <TD>
      <Button
        onClick={() => alert(JSON.stringify(request))}
        label="More details"
      />
    </TD>
  );
}

function VerifyRow({ proposal, challengePeriodEnd }: Request) {
  return (
    <>
      <TD>{proposal}</TD>
      <TD>{challengePeriodEnd.toString()}</TD>
    </>
  );
}

function ProposeRow({ type, bond, reward }: Request) {
  return (
    <>
      <TD>{type}</TD>
      <TD>{bond.toString()}</TD>
      <TD>{reward.toString()}</TD>
    </>
  );
}

function SettledRow({ type, settledAs }: Request) {
  return (
    <>
      <TD>{type}</TD>
      <TD>{settledAs}</TD>
    </>
  );
}

const Wrapper = styled.table`
  width: 100%;
  max-width: var(--page-width);
  border-spacing: 0 4px;
`;

const THead = styled.thead``;

const TBody = styled.tbody``;

const TR = styled.tr``;

const TH = styled.th`
  text-align: left;
`;

const TD = styled.td``;

const TitleTD = styled(TD)`
  width: var(--width);
`;

const TitleWrapper = styled.div`
  width: var(--width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
