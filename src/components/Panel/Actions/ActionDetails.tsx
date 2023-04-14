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
    <Wrapper>
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
          Challenge period ends
          <InformationIcon content={livenessInformation} />
        </ActionText>
        <ActionText>{formattedLivenessEndsIn}</ActionText>
      </ActionWrapper>
    </Wrapper>
  );
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

const rewardInformation = (
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

const ActionText = styled(Text)`
  display: flex;
  align-items: center;
  font: var(--body-sm);
`;

const Wrapper = styled.div`
  margin-bottom: 16px;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;
