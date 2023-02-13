import { red500 } from "@/constants";
import { addOpacityToHsl } from "@/helpers";
import { Page } from "@/types";
import { LoadingSkeleton } from "../LoadingSkeleton";
import {
  IconWrapper,
  TD,
  Text,
  TextWrapper,
  TitleHeader,
  TitleTD,
  TitleText,
  TitleWrapper,
  TR,
} from "./style";

/**
 * Loading row for the table
 * This is shown when the data is still loading
 * @param page - the page of the app, used to determine which columns to show
 */
export function LoadingRow({ page }: { page: Page }) {
  return (
    <TR>
      {loadingTitleCell}
      {page === "propose" ? loadingProposeCells : loadingVerifyOrSettledCells}
      <TD>
        <LoadingSkeleton
          width={24}
          height={24}
          borderRadius="50%"
          baseColor={addOpacityToHsl(red500, 0.1)}
          highlightColor={addOpacityToHsl(red500, 0.2)}
        />
      </TD>
    </TR>
  );
}

const loadingTitleCell = (
  <TitleTD>
    <TitleWrapper>
      <IconWrapper>
        <LoadingSkeleton
          width="clamp(24px, 3vw, 40px)"
          height="clamp(24px, 3vw, 40px)"
          borderRadius="50%"
        />
      </IconWrapper>
      <TextWrapper>
        <TitleHeader>
          <LoadingSkeleton width={400} />
        </TitleHeader>
        <TitleText>
          <LoadingSkeleton width={300} />
        </TitleText>
      </TextWrapper>
    </TitleWrapper>
  </TitleTD>
);

const loadingVerifyOrSettledCells = (
  <>
    <TD>
      <Text>
        <LoadingSkeleton />
      </Text>
    </TD>
    <TD>
      <LoadingSkeleton />
    </TD>
  </>
);

const loadingProposeCells = (
  <>
    <TD>
      <Text>
        <LoadingSkeleton />
      </Text>
    </TD>
    <TD>
      <Text>
        <LoadingSkeleton />
      </Text>
    </TD>
    <TD>
      <Text>
        <LoadingSkeleton />
      </Text>
    </TD>
  </>
);
