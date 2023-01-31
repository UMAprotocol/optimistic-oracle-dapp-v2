import { Page, Request } from "@/types";
import styled from "styled-components";
import { Headers } from "./Headers";
import { Row } from "./Row";

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

const Wrapper = styled.table`
  width: 100%;
  max-width: var(--page-width);
  border-spacing: 0 4px;
`;

const TBody = styled.tbody``;
