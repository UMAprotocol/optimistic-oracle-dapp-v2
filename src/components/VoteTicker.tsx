import { laptopAndUnder, mobileAndUnder, red500 } from "@/constants";
import { addOpacityToHsl } from "@/helpers";
import { useVotingInfo } from "@/hooks";
import { motion } from "framer-motion";
import NextLink from "next/link";
import Clock from "public/assets/clock.svg";
import UpRightArrow from "public/assets/up-right-arrow.svg";
import { useState } from "react";
import styled from "styled-components";
import { useInterval } from "usehooks-ts";

export default function VoteTicker() {
  const { data } = useVotingInfo();
  const [timeRemaining, setTimeRemaining] = useState("--:--:--");
  const isActive = !!data && data.activeRequests > 0;

  function getMillisecondsUntilMidnight() {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    return midnight.getTime() - now.getTime();
  }

  function formatMillisecondsUntilMidnight() {
    const milliseconds = getMillisecondsUntilMidnight();
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}:${minutes % 60}:${seconds % 60}`;
  }

  useInterval(() => {
    setTimeRemaining(formatMillisecondsUntilMidnight());
  }, 1000);

  return (
    <OuterWrapper
      initial={{ opacity: 0, translateY: "-20px" }}
      animate={{ opacity: 1, translateY: "0%" }}
      transition={{ duration: 0.3, delay: 0.8 }}
    >
      <InnerWrapper>
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
      </InnerWrapper>
    </OuterWrapper>
  );
}

const OuterWrapper = styled(motion.div)`
  display: grid;
  place-items: center;
  height: var(--vote-ticker-height);
  background: inherit;
  padding-top: 16px;
  padding-bottom: 4px;
  padding-inline: var(--page-padding);
  background-size: cover;
  background-repeat: no-repeat;

  @media ${laptopAndUnder} {
    padding-inline: 0;
  }
`;

const InnerWrapper = styled.div`
  width: 100%;
  max-width: var(--page-width);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 8px 8px;
  gap: 16px;
  isolation: isolate;
  background: var(--blue-grey-600);
  background-image: url("/assets/black-lines.png");
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 8px;
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
    fill: var(--red-500);
  }
`;

const ArrowIcon = styled(UpRightArrow)`
  path {
    stroke: var(--blue-grey-500);
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
  background: ${addOpacityToHsl(red500, 0.15)};
  border-radius: var(--border-radius);
`;

const TextWrapper = styled.div`
  font: var(--body-sm);
  color: var(--grey-300);
`;

const TimeRemaining = styled.span`
  display: inline-block;
  color: var(--white);
  margin-left: 4px;
  letter-spacing: 0.02em;
  min-width: 96px; // 96px is the width of the clock to prevent spacing changing on numbers.
`;

const DesktopText = styled.span`
  @media ${mobileAndUnder} {
    display: none;
  }
`;

const MobileText = styled.span`
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
  border-radius: 12px;
  font: var(--body-sm);
  color: var(--blue-grey-300);

  @media ${mobileAndUnder} {
    display: none;
  }
`;

const MoreDetailsWrapper = styled.div``;

const MoreDetailsText = styled.span`
  @media ${mobileAndUnder} {
    display: none;
  }
`;

const Link = styled(NextLink)`
  text-decoration: none;
  font: var(--body-sm);
  color: var(--grey-300);
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
