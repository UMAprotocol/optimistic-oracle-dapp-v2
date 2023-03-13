import { defaultResultsPerPage } from "@/constants";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Pagination } from "../Pagination";
import { Item } from "./Item";
import { LoadingItem } from "./LoadingItem";

interface Props {
  page: PageName;
  items: OracleQueryUI[];
  isLoading: boolean;
}
/**
 * Renders a list of oracle queries.
 * Intended to be shown on mobile.
 * @param page The page the queries are being rendered on.
 * @param items The queries to render.
 * @param isLoading Whether the queries are still loading.
 */
export function OracleQueryList({ page, items, isLoading }: Props) {
  const [itemsToShow, setItemsToShow] = useState(items);

  useEffect(() => {
    if (items.length <= defaultResultsPerPage) {
      setItemsToShow(items);
    }
  }, [items]);
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
          {itemsToShow.map((item) => (
            <Item key={item.id} page={page} item={item} />
          ))}
        </>
      )}
      {items.length > defaultResultsPerPage && !isLoading && (
        <PaginationWrapper>
          <Pagination entries={items} setEntriesToShow={setItemsToShow} />
        </PaginationWrapper>
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

const PaginationWrapper = styled.div`
  max-width: var(--page-width);
  margin-top: 32px;
  margin-inline: auto;
`;
