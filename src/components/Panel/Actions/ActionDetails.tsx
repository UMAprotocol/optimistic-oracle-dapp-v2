import { Currency, InformationIcon } from "@/components";
import type { OracleQueryUI } from "@/types";
import styled from "styled-components";
import { Link, Text } from "../style";

export function ActionDetails({
  bond,
  reward,
  formattedLivenessEndsIn,
  tokenAddress,
  chainId,
}: OracleQueryUI) {
  const hasReward = reward !== null;

  return (
    <ActionsDetailsWrapper>
      <ActionWrapper>
        <ActionText>
          Bond
          <InformationIcon content={bondInformation} />
        </ActionText>
        <ActionText>
          <Currency address={tokenAddress} chainId={chainId} value={bond} />
        </ActionText>
      </ActionWrapper>
      {hasReward && (
        <ActionWrapper>
          <ActionText>
            Reward
            <InformationIcon content={rewardInformation} />
          </ActionText>
          <ActionText>
            <Currency address={tokenAddress} chainId={chainId} value={reward} />
          </ActionText>
        </ActionWrapper>
      )}
      <ActionWrapper>
        <ActionText>
          Challenge period ends in
          <InformationIcon content={livenessInformation} />
        </ActionText>
        <ActionText>{formattedLivenessEndsIn}</ActionText>
      </ActionWrapper>
    </ActionsDetailsWrapper>
  );
}

// todo: @sean update copy
const bondInformation = (
  <>
    <p>
      Every request to UMA&apos;s Optimistic Oracle includes bond settings that
      specify the size of the bond that proposers (and disputers) are required
      to post.
    </p>
    <br />
    <p>The minimum bond is the final fee for a given bond token.</p>
    <br />
    <Link
      href="https://docs.uma.xyz/developers/setting-custom-bond-and-liveness-parameters"
      target="_blank"
    >
      Learn more
    </Link>
  </>
);

// todo: @sean update copy
const rewardInformation = (
  <>
    <p>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum, beatae.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
    </p>
    <br />
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis,
      mollitia!
    </p>
    <br />
    <Link
      href="https://docs.uma.xyz/developers/setting-custom-bond-and-liveness-parameters"
      target="_blank"
    >
      Learn more
    </Link>
  </>
);

// todo: @sean update copy
const livenessInformation = (
  <>
    <p>
      Every request to UMA&apos;s Optimistic Oracle includes liveness settings
      that specify the liveness window, which is the challenge period during
      which a proposal can be challenged.
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

const ActionText = styled(Text)`
  display: flex;
  align-items: center;
  font: var(--body-sm);
`;

const ActionsDetailsWrapper = styled.div`
  margin-bottom: 16px;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;
