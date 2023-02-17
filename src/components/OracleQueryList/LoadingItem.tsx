import { red500 } from "@/constants";
import { addOpacityToHsla } from "@/helpers";
import { LoadingSkeleton } from "../LoadingSkeleton";
import {
  ClickableIconWrapper,
  HeaderWrapper,
  ItemDetailsInnerWrapper,
  ItemDetailsWrapper,
  ItemInnerWrapper,
  ItemWrapper,
  TitleHeader,
  TitleText,
  TitleWrapper,
} from "./style";

export function LoadingItem() {
  return (
    <ItemWrapper>
      <ItemInnerWrapper>
        {loadingTitle}
        <ClickableIconWrapper>
          <LoadingSkeleton
            width="100%"
            height="100%"
            borderRadius="50%"
            baseColor={addOpacityToHsla(red500, 0.1)}
            highlightColor={addOpacityToHsla(red500, 0.2)}
          />
        </ClickableIconWrapper>
      </ItemInnerWrapper>
      {loadingDetails}
    </ItemWrapper>
  );
}

const loadingTitle = (
  <TitleWrapper>
    <HeaderWrapper>
      <LoadingSkeleton width={18} height={18} borderRadius="50%" />
      <TitleHeader>
        <LoadingSkeleton width={150} />
      </TitleHeader>
    </HeaderWrapper>
    <TitleText>
      <LoadingSkeleton width={200} />
    </TitleText>
  </TitleWrapper>
);

const loadingDetails = (
  <ItemDetailsWrapper>
    <ItemDetailsInnerWrapper>
      <LoadingSkeleton width={100} />
      <LoadingSkeleton width={100} />
    </ItemDetailsInnerWrapper>
    <ItemDetailsInnerWrapper>
      <LoadingSkeleton width={100} />
      <LoadingSkeleton width={100} />
    </ItemDetailsInnerWrapper>
  </ItemDetailsWrapper>
);
