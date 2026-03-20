import { Currency, InformationIcon } from "@/components";
import { config } from "@/constants";
import { usePageContext } from "@/hooks";
import type { OracleQueryUI } from "@/types";
import { Link } from "../style";

export function Details({
  bond,
  customBond,
  reward,
  formattedLivenessEndsIn,
  customLiveness,
  tokenAddress,
  chainId,
  oracleType,
}: OracleQueryUI) {
  const { page } = usePageContext();
  const pageIsPropose = page === "propose";
  const isManaged = oracleType === "Managed Optimistic Oracle V2";

  const hasReward = reward !== null && reward !== undefined;
  const disputerReward = customBond !== undefined ? customBond / 2n : undefined;

  return (
    <div className="mb-4 bg-white rounded-md py-2 px-3">
      <TextWrapper>
        <Text>
          Bond
          <InformationIcon content={bondInformation} />
        </Text>
        <Text>
          <Currency
            showAddressLink
            address={tokenAddress}
            chainId={chainId}
            value={bond}
          />
        </Text>
      </TextWrapper>
      {hasReward && (
        <TextWrapper>
          <Text>
            {pageIsPropose ? "Proposer Reward" : "Disputer Reward"}
            <InformationIcon
              content={
                pageIsPropose
                  ? proposerRewardInformation
                  : disputerRewardInformation
              }
            />
          </Text>
          <Text>
            <Currency
              showAddressLink
              address={tokenAddress}
              chainId={chainId}
              value={pageIsPropose ? reward : disputerReward}
            />
          </Text>
        </TextWrapper>
      )}
      <TextWrapper>
        <Text>
          {pageIsPropose
            ? "Challenge period length"
            : isManaged
            ? "Minimum challenge period ends"
            : "Challenge period ends"}
          <InformationIcon content={livenessInformation} />
        </Text>
        <Text>
          {pageIsPropose
            ? formatLivenessDuration(customLiveness)
            : formattedLivenessEndsIn}
        </Text>
      </TextWrapper>
    </div>
  );
}

function formatLivenessDuration(customLiveness: string | undefined): string {
  const seconds = Number(customLiveness ?? config.defaultLiveness);
  if (isNaN(seconds) || seconds <= 0) return "";
  const minutes = Math.round(seconds / 60);
  if (minutes < 120) return `${minutes} minutes`;
  return `${Math.round(minutes / 60)} hours`;
}

const bondInformation = (
  <>
    <p>
      Every request to UMA&apos;s Optimistic Oracle specifies a bond size that
      both proposers and disputers are required to post. In the event of a
      dispute, the correct party will receive some portion of the losers bond.
    </p>
    <br />
    <br />
    <Link
      href="https://docs.uma.xyz/developers/setting-custom-bond-and-liveness-parameters"
      target="_blank"
    >
      Learn more
    </Link>
  </>
);

const proposerRewardInformation = (
  <>
    <p>
      Rewards are posted by data requesters and are distributed to correct
      proposers once liveness is complete and the proposal is settled.
    </p>
    <br />
    <br />
    <Link
      href="https://docs.uma.xyz/developers/setting-custom-bond-and-liveness-parameters"
      target="_blank"
    >
      Learn more
    </Link>
  </>
);

const disputerRewardInformation = (
  <>
    <p>
      Successful disputers will receive a portion of the proposer&apos;s bond as
      a reward.
    </p>
    <br />
    <br />
    <Link
      href="https://docs.uma.xyz/developers/setting-custom-bond-and-liveness-parameters"
      target="_blank"
    >
      Learn more
    </Link>
  </>
);

const livenessInformation = (
  <>
    <p>
      Every request to UMA&apos;s Optimistic Oracle specifies liveness settings
      that define the length of challenge period during which a proposal can be
      challenged.
    </p>
    <br />
    <p>A typical liveness window is two hours.</p>
    <br />
    <Link
      href="https://docs.uma.xyz/developers/setting-custom-bond-and-liveness-parameters"
      target="_blank"
    >
      Learn more
    </Link>
  </>
);

const Text = ({ children }: { children: React.ReactNode }) => (
  <p className="flex items-center">{children}</p>
);

const TextWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-between last-of-type:mt-4 [&:not(:last-child)]:mb-1">
    {children}
  </div>
);
