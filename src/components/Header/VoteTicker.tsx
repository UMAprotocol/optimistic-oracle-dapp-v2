import { mobileAndUnder } from "@/constants";
import { useVotingInfo } from "@/hooks";
import NextLink from "next/link";
import Clock from "public/assets/icons/clock.svg";
import UpRightArrow from "public/assets/icons/up-right-arrow.svg";
import { useState } from "react";
import styled from "styled-components";
import { useInterval } from "usehooks-ts";

export function VoteTicker() {
  const { data } = useVotingInfo();
  const [timeRemaining, setTimeRemaining] = useState(
    formatMillisecondsUntilMidnight()
  );
  const isActive = !!data && data.activeRequests > 0 && timeRemaining !== "";

  function getMillisecondsUntilMidnight() {
    const now = new Date();
    const midnight = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );
    return midnight.getTime() - now.getTime();
  }

  function formatMillisecondsUntilMidnight() {
    const milliseconds = getMillisecondsUntilMidnight();
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, "0")}:${(minutes % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  }

  useInterval(() => {
    setTimeRemaining(formatMillisecondsUntilMidnight());
  }, 1000);

  console.log({ data });

  if (!data) return null;

  return (
    <Wrapper>
      <VoteDetails>
        <ClockWrapper>
          <ClockIcon />
        </ClockWrapper>
        {isActive ? (
          <>
            <TextWrapper>
              <DesktopText>Time to {data.phase} vote: </DesktopText>
              <MobileText>{data.phase} vote: </MobileText>
              <TimeRemaining>{timeRemaining}</TimeRemaining>
            </TextWrapper>
            <NumVotes>
              {data.activeRequests === 1
                ? "1 vote"
                : `${data.activeRequests} votes`}
            </NumVotes>
          </>
        ) : (
          <TextWrapper>
            <DesktopText>No active votes</DesktopText>
            <MobileText>No votes</MobileText>
          </TextWrapper>
        )}
      </VoteDetails>
      <MoreDetailsWrapper>
        <Link
          href="https://vote.uma.xyz/"
          target="_blank"
          aria-label="Link to voter dapp"
        >
          <MoreDetailsText>More details</MoreDetailsText>
          <ArrowIcon />
        </Link>
      </MoreDetailsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: var(--vote-ticker-height);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 8px 8px;
  color: var(--blue-grey-300);
  background: var(--blue-grey-600);
  border-radius: 8px;
  background-image: url("/assets/black-lines.png");
  background-size: cover;
  background-repeat: no-repeat;
`;

const VoteDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 16px;
`;

const ClockIcon = styled(Clock)`
  g {
    fill: var(--red-500-opacity-15);
  }
`;

const ArrowIcon = styled(UpRightArrow)`
  path {
    stroke: var(--blue-grey-300);
  }
`;

const ClockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 32px;
  height: 32px;
  background: var(--red-500-opacity-15);
  border-radius: 50%;
`;

const TextWrapper = styled.div`
  font: var(--body-sm);
  color: var(--blue-grey-300);
`;

const TimeRemaining = styled.span`
  color: inherit;
  display: inline-block;
  color: var(--white);
  margin-left: 4px;
  letter-spacing: 0.02em;
  min-width: 96px; // 96px is the width of the clock to prevent spacing changing on numbers.
`;

const DesktopText = styled.span`
  color: inherit;
  @media ${mobileAndUnder} {
    display: none;
  }
`;

const MobileText = styled.span`
  color: inherit;
  display: none;
  @media ${mobileAndUnder} {
    display: inline;
  }
`;

const NumVotes = styled.div`
  height: fit-content;
  white-space: nowrap;
  padding-inline: 8px;
  padding-block: 4px;
  background: var(--blue-grey-500);
  border-radius: 14px;
  font: var(--body-sm);
  color: inherit;

  @media ${mobileAndUnder} {
    display: none;
  }
`;

const MoreDetailsWrapper = styled.div``;

const MoreDetailsText = styled.span`
  color: var(--blue-grey-300);
  @media ${mobileAndUnder} {
    display: none;
  }
`;

const Link = styled(NextLink)`
  text-decoration: none;
  font: var(--body-sm);
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 8px;
  transition: opacity var(--animation-duration);
  &:hover {
    opacity: 0.5;
  }
`;
