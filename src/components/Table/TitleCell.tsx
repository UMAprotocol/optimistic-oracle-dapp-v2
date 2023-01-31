import { Request } from "@/types";
import { format } from "date-fns";
import Cozy from "public/assets/icons/projects/cozy.svg";
import Polymarket from "public/assets/icons/projects/polymarket.svg";
import StakeCom from "public/assets/icons/projects/stake.com.svg";
import Uma from "public/assets/icons/projects/uma.svg";
import styled from "styled-components";
import { TD } from "./style";

export function TitleCell({ title, project, chain, time }: Request) {
  const projectIcons = {
    UMA: <UmaIcon />,
    Polymarket: <PolymarketIcon />,
    "Stake.com": <StakeComIcon />,
    "Cozy Finance": <CozyIcon />,
  };

  const projectIcon = project ? projectIcons[project] : <UmaIcon />;

  const date = format(new Date(time.mul(1000).toNumber()), "Pp");

  return (
    <TitleTD>
      <TitleWrapper>
        <IconWrapper>{projectIcon}</IconWrapper>
        <TextWrapper>
          <TitleHeader>{title}</TitleHeader>
          <TitleText>
            {project} | {date} | {chain}
          </TitleText>
        </TextWrapper>
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

const TitleHeader = styled.h3``;

const IconWrapper = styled.div``;

const TextWrapper = styled.div``;

const TitleText = styled.p``;

const CozyIcon = styled(Cozy)``;

const UmaIcon = styled(Uma)``;

const StakeComIcon = styled(StakeCom)``;

const PolymarketIcon = styled(Polymarket)``;
