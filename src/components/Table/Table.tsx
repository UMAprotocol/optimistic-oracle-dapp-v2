import { Page, Request } from "@/types";
import styled from "styled-components";
import { Button } from "../Button";

interface Props {
  page: Page;
  requests: Request[];
}
export function Table({ page, requests }: Props) {
  return (
    <table>
      <Headers page={page} />
      <TBody>
        {requests.map((request) => (
          <Row key={request.id} page={page} request={request} />
        ))}
      </TBody>
    </table>
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
  const rows = {
    verify: <VerifyRow {...request} />,
    propose: <ProposeRow {...request} />,
    settled: <SettledRow {...request} />,
  };

  const row = rows[page];

  return (
    <TR>
      <RequestCell {...request} />
      {row}
      <MoreDetailsCell request={request} />
    </TR>
  );
}

function RequestCell({ title, project, chain, time }: Request) {
  return (
    <TD>
      <span>{title}</span>
      <span>{project}</span>
      <span>{chain}</span>
      <span>{time.toString()}</span>
    </TD>
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

const THead = styled.thead``;

const TBody = styled.tbody``;

const TR = styled.tr``;

const TH = styled.th``;

const TD = styled.td``;
