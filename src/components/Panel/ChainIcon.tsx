import { supportedChainsById } from "@/constants";
import { SupportedChainIds } from "@/types";
import Arbitrum from "public/assets/icons/chains/arbitrum.svg";
import Avalanche from "public/assets/icons/chains/avax.svg";
import Boba from "public/assets/icons/chains/boba.svg";
import Ethereum from "public/assets/icons/chains/ethereum.svg";
import Gnosis from "public/assets/icons/chains/gnosis.svg";
import Optimism from "public/assets/icons/chains/optimism.svg";
import Polygon from "public/assets/icons/chains/polygon.svg";
import SX from "public/assets/icons/chains/sx.svg";
import styled from "styled-components";

export function ChainIcon({
  chainId,
}: {
  chainId: SupportedChainIds | undefined;
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
    <Wrapper>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <ChainName>{chainName}</ChainName>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 35px;
  width: max-content;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-inline: 10px;
  padding-block: 8px;
  border: 1px solid var(--grey-100);
  border-radius: 5px;
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
`;

const ChainName = styled.p`
  font: var(--text-sm);
`;

const EthereumIcon = styled(Ethereum)``;

const OptimismIcon = styled(Optimism)``;

const PolygonIcon = styled(Polygon)``;

const ArbitrumIcon = styled(Arbitrum)``;

const GnosisIcon = styled(Gnosis)``;

const BobaIcon = styled(Boba)``;

const SXIcon = styled(SX)``;

const AvalancheIcon = styled(Avalanche)``;
