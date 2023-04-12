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

  return (
    <TitleWrapper>
      <ProjectIconWrapper>{projectIcon}</ProjectIconWrapper>
      <TitleText id="panel-title">
        <TruncatedTitle title={title} />
      </TitleText>
      <CloseButtonWrapper>
        <CloseButton
          onClick={close}
          size="clamp(1rem, calc(0.92rem + 0.41vw), 1.25rem)"
        />
      </CloseButtonWrapper>
    </TitleWrapper>
  );
}

const TitleText = styled.h1`
  max-width: 400px;
  font: var(--body-md);
  color: var(--light-text);
`;

const TitleWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--page-padding);
  min-height: 84px;
  padding-inline: var(--padding-inline);
  padding-block: 20px;
  background: var(--blue-grey-700);
`;

const ProjectIconWrapper = styled.div`
  width: clamp(1.25rem, calc(0.84rem + 2.04vw), 2.5rem);
`;

const CloseButtonWrapper = styled.div`
  width: clamp(1.25rem, calc(0.84rem + 2.04vw), 2.5rem);
`;
