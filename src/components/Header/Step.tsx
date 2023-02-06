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
      <NumberIcon />
      <Text>{text}</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  gap: 16px;
`;

const Text = styled.p`
  max-width: 270px;
  font: var(--body-sm);
  color: var(--white);
`;

const OneIcon = styled(One)``;

const TwoIcon = styled(Two)``;

const ThreeIcon = styled(Three)``;
