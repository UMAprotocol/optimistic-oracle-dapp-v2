import { Page } from "@/types";
import styled from "styled-components";
import { TR } from "./style";

export function Headers({ page }: { page: Page }) {
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
const THead = styled.thead``;

const TH = styled.th`
  text-align: left;
  font: var(--body-sm);
  color: var(--blue-grey-700);
  padding-bottom: 4px;
`;
