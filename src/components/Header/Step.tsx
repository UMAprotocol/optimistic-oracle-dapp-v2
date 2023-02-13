import { tabletAndUnder } from "@/constants";
import One from "public/assets/icons/one.svg";
import Three from "public/assets/icons/three.svg";
import Two from "public/assets/icons/two.svg";
import styled from "styled-components";

interface Props {
  number: number;
  text: string;
}
export function Step({ number, text }: Props) {
  const numberIcons = [OneIcon, TwoIcon, ThreeIcon];
  const NumberIcon = numberIcons[number];

  return (
    <Wrapper>
      <IconWrapper>
        <NumberIcon />
      </IconWrapper>
      <Text>{text}</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: clamp(0.5rem, calc(0.34rem + 0.82vw), 1rem);

  @media ${tabletAndUnder} {
    align-items: center;
  }
`;

const Text = styled.p`
  max-width: 270px;
  font: var(--body-sm);
  color: var(--white);

  @media ${tabletAndUnder} {
    max-width: unset;
  }
`;

const IconWrapper = styled.div`
  --icon-size: clamp(1rem, calc(0.84rem + 0.82vw), 1.5rem);
  min-width: var(--icon-size);
  min-height: var(--icon-size);
`;

const OneIcon = styled(One)``;

const TwoIcon = styled(Two)``;

const ThreeIcon = styled(Three)``;
