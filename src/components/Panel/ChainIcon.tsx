import { supportedChainsById } from "@/constants";
import { SupportedChainId } from "@/types";
import Arbitrum from "public/assets/icons/chains/arbitrum.svg";
import Avalanche from "public/assets/icons/chains/avax.svg";
import Boba from "public/assets/icons/chains/boba.svg";
import Ethereum from "public/assets/icons/chains/ethereum.svg";
import Gnosis from "public/assets/icons/chains/gnosis.svg";
import Optimism from "public/assets/icons/chains/optimism.svg";
import Polygon from "public/assets/icons/chains/polygon.svg";
import SX from "public/assets/icons/chains/sx.svg";
import styled from "styled-components";
import { IconWrapper } from "../IconWrapper";
import { InfoIconText, InfoIconWrapper } from "./styles";

export function ChainIcon({
  chainId,
}: {
  chainId: SupportedChainId | undefined;
}) {
  if (!chainId) return null;

  const icons = {
    1: EthereumIcon,
    5: EthereumIcon,
    10: OptimismIcon,
    100: GnosisIcon,
    137: PolygonIcon,
    288: BobaIcon,
    416: SXIcon,
    43114: AvalancheIcon,
    42161: ArbitrumIcon,
  };

  const chainName = supportedChainsById[chainId];
  const Icon = icons[chainId];
  if (!Icon || !chainName) return null;

  return (
    <InfoIconWrapper>
      <IconWrapper width={24} height={24}>
        <Icon />
      </IconWrapper>
      <InfoIconText>{chainName}</InfoIconText>
    </InfoIconWrapper>
  );
}

const EthereumIcon = styled(Ethereum)``;

const OptimismIcon = styled(Optimism)``;

const PolygonIcon = styled(Polygon)``;

const ArbitrumIcon = styled(Arbitrum)``;

const GnosisIcon = styled(Gnosis)``;

const BobaIcon = styled(Boba)``;

const SXIcon = styled(SX)``;

const AvalancheIcon = styled(Avalanche)``;
