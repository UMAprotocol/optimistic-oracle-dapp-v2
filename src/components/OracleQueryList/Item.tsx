import { OracleQueryClickableIcon, oracleQueryHover } from "@/components/style";
import type { OracleQueryUI, Page } from "@/types";
import styled from "styled-components";
import { ItemDetails } from "./ItemDetails";
import { ItemTitle } from "./ItemTitle";

interface Props {
  page: Page;
  item: OracleQueryUI;
}
export function Item({ page, item }: Props) {
  return (
    <Wrapper>
      <InnerWrapper>
        <ItemTitle {...item} />
        <ClickableIconWrapper>
          <OracleQueryClickableIcon />
        </ClickableIconWrapper>
      </InnerWrapper>
      <ItemDetails page={page} {...item} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding-inline: 16px;
  padding-block: 12px;
  background: var(--white);
  border-radius: 4px;

  ${oracleQueryHover}
`;

const InnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 4px;
`;

const ClickableIconWrapper = styled.div`
  width: 16px;
  height: 16px;
  margin-top: 2px;
`;
