import { getProjectIcon } from "@/constants";
import type { OracleQueryUI } from "@/types";
import styled from "styled-components";
import { CloseButton } from "../CloseButton";
import { TruncatedTitle } from "../TruncatedTitle";

interface Props extends OracleQueryUI {
  close: () => void;
}
export function Title({ project, title, close }: Props) {
  const projectIcon = getProjectIcon(project);

  const buttonMinWidth = "1rem";
  const buttonMaxWidth = "1.25rem";
  const buttonPreferredWidth = "calc(0.9rem + 0.4vw)";
  const buttonClampedWidth = `clamp(${buttonMinWidth}, ${buttonPreferredWidth}, ${buttonMaxWidth})`;

  return (
    <Wrapper>
      <IconWrapper>{projectIcon}</IconWrapper>
      <TitleText id="panel-title">
        <TruncatedTitle title={title} />
      </TitleText>
      <IconWrapper>
        <CloseButton onClick={close} size={buttonClampedWidth} />
      </IconWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--page-padding);
  min-height: 84px;
  padding-inline: var(--padding-inline);
  padding-block: 20px;
  background: var(--blue-grey-700);
`;

const TitleText = styled.h1`
  max-width: 400px;
  font: var(--body-md);
  color: var(--light-text);
`;

const IconWrapper = styled.div`
  --icon-min-width: 1.25rem;
  --icon-max-width: 2.5rem;
  --icon-preferred-width: calc(0.8rem + 2vw);
  --icon-clamped-width: clamp(
    var(--icon-min-width),
    var(--icon-preferred-width),
    var(--icon-max-width)
  );
  width: var(--icon-clamped-width);
`;