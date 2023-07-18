import { getProjectIcon } from "@/constants";
import type { OracleQueryUI } from "@/types";
import styled from "styled-components";
import { CloseButton } from "../CloseButton";
import { TruncatedTitle } from "../TruncatedTitle";

interface Props extends OracleQueryUI {
  close: () => void;
}
export function Title({ project, title, close }: Props) {
  const ProjectIcon = getProjectIcon(project);

  const buttonMinWidth = "1rem";
  const buttonMaxWidth = "1.25rem";
  const buttonPreferredWidth = "calc(0.9rem + 0.4vw)";
  const buttonClampedWidth = `clamp(${buttonMinWidth}, ${buttonPreferredWidth}, ${buttonMaxWidth})`;

  return (
    <Wrapper>
      <ProjectIcon className="min-w-[1.25rem] w-[clamp(1.25rem,0.8rem+2vw,2.5rem)] h-[clamp(1.25rem,0.8rem+2vw,2.5rem)]" />
      <TitleText id="panel-title">
        <TruncatedTitle title={title} />
      </TitleText>
      <div className="min-w-[1.25rem] w-[clamp(1.25rem,0.8rem+2vw,2.5rem)] h-[clamp(1.25rem,0.8rem+2vw,2.5rem)]">
        <CloseButton onClick={close} size={buttonClampedWidth} />
      </div>
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
