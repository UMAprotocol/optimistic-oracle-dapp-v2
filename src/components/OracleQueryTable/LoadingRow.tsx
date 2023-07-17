import { addOpacityToColor } from "@/helpers";
import type { PageName } from "@shared/types";
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
export function LoadingRow({ page }: { page: PageName }) {
  return (
    <TR>
      {loadingTitleCell}
      {page === "verify" && loadingVerifyCells}
      {page === "propose" && loadingProposeCells}
      {page === "settled" && loadingSettledCells}
      <TD>
        <LoadingSkeleton
          width={24}
          height={24}
          borderRadius="50%"
          baseColor={addOpacityToColor("var(--red-500)", 0.1)}
          highlightColor={addOpacityToColor("var(--red-500)", 0.2)}
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

const loadingVerifyCells = (
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
      <LoadingSkeleton />
    </TD>
  </>
);

const loadingSettledCells = (
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
