import { Request } from "@/types";
import styled from "styled-components";
import { TD } from "./style";

export function TitleCell({ title, project, chain, time }: Request) {
  return (
    <TitleTD>
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
  width: calc(var(--table-width) * 0.45);
`;

const TitleWrapper = styled.div`
  width: calc(var(--table-width) * 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
