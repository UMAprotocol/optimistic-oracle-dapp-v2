import { Request } from "@/types";
import { CSSProperties } from "react";
import styled from "styled-components";
import { TD } from "./style";

export function TitleCell({
  title,
  project,
  chain,
  time,
  rowWidth,
}: Request & { rowWidth: number }) {
  const width = rowWidth * 0.45;
  const style = {
    "--width": `${width}px`,
  } as CSSProperties;

  return (
    <TitleTD style={style}>
      <TitleWrapper>
        {title}
        {project}
        {chain}
        {time.toString()}
      </TitleWrapper>
    </TitleTD>
  );
}
const TitleTD = styled(TD)`
  width: var(--width);
`;

const TitleWrapper = styled.div`
  width: var(--width);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
