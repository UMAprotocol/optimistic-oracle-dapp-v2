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
      <_Table>
        <Headers page={page} />
        <TBody>
          {requests.map((request) => (
            <Row key={request.id} page={page} request={request} />
          ))}
        </TBody>
      </_Table>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: var(--grey-400);
  padding-bottom: 64px;
  padding-top: 24px;
`;

const _Table = styled.table`
  width: 100%;
  max-width: var(--page-width);
  margin-inline: auto;
  border-spacing: 0 4px;
`;

const TBody = styled.tbody`
  background: var(--white);
`;
