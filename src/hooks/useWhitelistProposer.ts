import { shortenIfAddress, sleep } from "@libs/utils";
import { useAccount, useQuery } from "wagmi";

async function isUserWhitelisted(
  address: string | undefined,
): Promise<boolean> {
  console.log(`Checking if ${shortenIfAddress(address)} is whitelisted`);
  await sleep(500);
  // 1. connect to ManagedOO contract
  // 2. call view function getProposerWhitelistWithEnforcementStatus
  // 3. check `isEnforced`
  // 4. check `allowedProposers`
  // 5. resolve user status, return

  return false;
}

export function useIsUserWhitelisted() {
  const { address } = useAccount();
  return useQuery(["whitelist-proposer", address], {
    queryFn: () => isUserWhitelisted(address),
    refetchInterval: 30_000, // 30 seconds
  });
}
