import Box from "public/assets/box.svg";
import styled from "styled-components";

export function Title() {
  return (
    <Wrapper>
      <BoxIcon />
      <TitleText>
        Verify <strong>19</strong> statements
      </TitleText>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`;

const BoxIcon = styled(Box)``;

const TitleText = styled.h1`
  font: var(--header-md);
  font-size: 52px;
  line-height: 72px;
  color: var(--white);

  strong {
    font-weight: inherit;
    color: var(--red-500);
  }
`;
