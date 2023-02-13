import Clickable from "public/assets/icons/clickable.svg";
import styled from "styled-components";

export const ClickableIcon = styled(Clickable)`
  transition: fill var(--animation-duration);

  path {
    transition: stroke var(--animation-duration);
  }
`;

export const TR = styled.tr`
  height: 80px;
  border-radius: 4px;
  cursor: pointer;

  & :first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  & :last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:hover {
    h3 {
      color: var(--red-500);
    }

    ${ClickableIcon} {
      fill: var(--red-500);

      path {
        stroke: var(--white);
      }
    }
  }
`;

export const TD = styled.td`
  padding-inline: var(--gap);
`;

export const Text = styled.p`
  font: var(--body-sm);
`;
export const TitleTD = styled(TD)``;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: var(--gap);
`;

export const TitleHeader = styled.h3`
  max-width: min(500px, 50vw);
  font: var(--body-sm);
  font-weight: 600;
  transition: color var(--animation-duration);
`;

export const IconWrapper = styled.div`
  width: clamp(24px, 3vw, 40px);
  aspect-ratio: 1;
`;

export const TextWrapper = styled.div``;

export const TitleText = styled.p`
  margin-top: 4px;
  font: var(--body-xs);
`;
