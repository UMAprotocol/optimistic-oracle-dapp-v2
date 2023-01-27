import { Page } from "@/types";
import styled from "styled-components";

export function Table({ page }: { page: Page }) {
  return (
    <_Table>
      <Headers page={page} />
      <TBody>
        <TR>
          <TD>{page}</TD>
        </TR>
      </TBody>
    </_Table>
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

const _Table = styled.table``;

const THead = styled.thead``;

const TBody = styled.tbody``;

const TR = styled.tr``;

const TH = styled.th``;

const TD = styled.td``;
