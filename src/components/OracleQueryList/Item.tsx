import { OracleQueryClickableIcon } from "@/components/style";
import { usePanelContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { ItemDetails } from "./ItemDetails";
import { ItemTitle } from "./ItemTitle";
import { ClickableIconWrapper, ItemInnerWrapper, ItemWrapper } from "./style";

interface Props {
  page: PageName;
  item: OracleQueryUI;
}
export function Item({ page, item }: Props) {
  const { openPanel } = usePanelContext();

  return (
    <ItemWrapper onClick={() => openPanel(item)}>
      <ItemInnerWrapper>
        <ItemTitle {...item} />
        <ClickableIconWrapper>
          <OracleQueryClickableIcon />
        </ClickableIconWrapper>
      </ItemInnerWrapper>
      <ItemDetails page={page} item={item} />
    </ItemWrapper>
  );
}
