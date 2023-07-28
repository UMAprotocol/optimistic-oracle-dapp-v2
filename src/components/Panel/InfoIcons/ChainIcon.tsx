import { PanelInfoIconText, PanelInfoIconWrapper } from "@/components/style";
import { getChainIcon } from "@/constants";
import { chainsById } from "@shared/constants";
import type { ChainId } from "@shared/types";

/**
 * Displays an icon for the given chain ID.
 * @param chainId The chain ID to display an icon for.
 * @returns The icon for the given chain ID, or null if the chain ID is not supported.
 * @see supportedChainsById
 */
export function ChainIcon({ chainId }: { chainId: ChainId | undefined }) {
  if (!chainId) return null;
  const chainName = chainsById[chainId];
  const Icon = getChainIcon(chainId);
  if (!Icon) return null;

  return (
    <PanelInfoIconWrapper>
      <Icon className="w-6 h-6" />
      <PanelInfoIconText>{chainName}</PanelInfoIconText>
    </PanelInfoIconWrapper>
  );
}
