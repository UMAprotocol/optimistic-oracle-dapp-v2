import type { OracleQueryUI, Page } from "@/types";
import styled from "styled-components";
import { Item } from "./Item";
import { LoadingItem } from "./LoadingItem";

interface Props {
  page: Page;
  items: OracleQueryUI[];
  isLoading: boolean;
}
export function OracleQueryList({ page, items, isLoading }: Props) {
  return (
    <Wrapper>
      <Title>Query</Title>
      {isLoading ? (
        <>
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingItem key={index} />
          ))}
        </>
      ) : (
        <>
          {items.map((item) => (
            <Item key={item.id} page={page} item={item} />
          ))}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: var(--grey-400);
  padding-inline: var(--page-padding);
  padding-top: 16px;
  padding-bottom: 64px;

  > div:not(:last-child) {
    margin-bottom: 4px;
  }
`;

const Title = styled.h1`
  font: var(--body-xs);
  margin-bottom: 8px;
`;
