import { getChainIcon } from "@/constants";
import type { ChainId, ChainName } from "@shared/types";

interface Props {
  chainName: ChainName;
  chainId: ChainId;
}
export function ChainNameAndIcon({ chainName, chainId }: Props) {
  const ChainIcon = getChainIcon(chainId);

  return (
    <span className="inline-flex items-baseline mr-[2px] ml-[3px]">
      {ChainIcon && (
        <ChainIcon className="inline-block self-center w-[14px] h-[14px] mr-[3px]" />
      )}{" "}
      {chainName}
    </span>
  );
}
