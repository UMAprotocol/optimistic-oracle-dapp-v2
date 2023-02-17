import { OracleQueryClickableIcon } from "@/components/style";
import type { OracleQueryUI, Page } from "@/types";
import { ItemDetails } from "./ItemDetails";
import { ItemTitle } from "./ItemTitle";
import { ClickableIconWrapper, ItemInnerWrapper, ItemWrapper } from "./style";

interface Props {
  page: Page;
  item: OracleQueryUI;
}
export function Item({ page, item }: Props) {
  return (
    <ItemWrapper>
      <ItemInnerWrapper>
        <ItemTitle {...item} />
        <ClickableIconWrapper>
          <OracleQueryClickableIcon />
        </ClickableIconWrapper>
      </ItemInnerWrapper>
      <ItemDetails page={page} {...item} />
    </ItemWrapper>
  );
}
