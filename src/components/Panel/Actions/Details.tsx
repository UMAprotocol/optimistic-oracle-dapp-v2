import { Currency, InformationIcon } from "@/components";
import type { OracleQueryUI } from "@/types";
import styled from "styled-components";
import { Link, Text } from "../style";

export function Details({
  bond,
  reward,
  formattedLivenessEndsIn,
  tokenAddress,
  chainId,
}: OracleQueryUI) {
  const hasReward = reward !== null;

  return (
    <Wrapper>
      <TextWrapper>
        <_Text>
          Bond
          <InformationIcon content={bondInformation} />
        </_Text>
        <_Text>
          <Currency address={tokenAddress} chainId={chainId} value={bond} />
        </_Text>
      </TextWrapper>
      {hasReward && (
        <TextWrapper>
          <_Text>
            Reward
            <InformationIcon content={rewardInformation} />
          </_Text>
          <_Text>
            <Currency address={tokenAddress} chainId={chainId} value={reward} />
          </_Text>
        </TextWrapper>
      )}
      <TextWrapper>
        <_Text>
          Challenge period ends
          <InformationIcon content={livenessInformation} />
        </_Text>
        <_Text>{formattedLivenessEndsIn}</_Text>
      </TextWrapper>
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

const _Text = styled(Text)`
  display: flex;
  align-items: center;
  font: var(--body-sm);
`;

const Wrapper = styled.div`
  margin-bottom: 16px;
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  &:not(:last-child) {
    margin-bottom: 4px;
  }
`;
