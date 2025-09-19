import { OracleQueryClickableIcon } from "@/components/style";
import { usePanelContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import { ItemDetails } from "./ItemDetails";
import { ItemTitle } from "./ItemTitle";
import { ClickableIconWrapper, ItemInnerWrapper, ItemWrapper } from "./style";
import { useCustomBond } from "@/hooks/useCustomBond";

interface Props {
  page: PageName;
  item: OracleQueryUI;
}
export function Item({ page, item: query }: Props) {
  const { openPanel } = usePanelContext();

  const customBondData = useCustomBond({
    query,
  });

  const item: OracleQueryUI = {
    ...query,
    bond: customBondData?.data?.bond ?? query.bond,
  };

  return (
    <ItemWrapper onClick={() => void openPanel(item.id)}>
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
