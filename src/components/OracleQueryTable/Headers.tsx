import type { PageName } from "@shared/types";
import styled from "styled-components";

/**
 * Table headers
 * @param page - the page of the app, used to determine which columns to show
 */
export function Headers({ page }: { page: PageName }) {
  const verify = [
    "Query/Statement",
    "Proposal/Assertion",
    "Bond",
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

const TR = styled.tr``;

const TH = styled.th`
  white-space: nowrap;
  text-align: left;
  font: var(--body-sm);
  color: var(--blue-grey-700);
  padding-inline: var(--gap);
  padding-bottom: 4px;
`;
