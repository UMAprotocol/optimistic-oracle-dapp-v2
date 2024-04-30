"use client";

import { Indicator, Root } from "@radix-ui/react-progress";
import { formatDuration, intervalToDuration } from "date-fns";
import type { CSSProperties } from "react";
import { useState } from "react";
import styled, { css } from "styled-components";
import { useInterval } from "usehooks-ts";

interface Props {
  startTime: number;
  endTime: number;
  fontSize?: number;
  marginBottom?: number;
}
/**
 * A progress bar that shows the time remaining until a request or assertion
 * expires.
 * @param startTime Time the request or assertion was made in milliseconds
 * @param endTime Time the request or assertion will expire in milliseconds
 */
export function LivenessProgressBar({
  startTime,
  endTime,
  fontSize,
  marginBottom,
}: Props) {
  const [now, setNow] = useState(new Date());

  useInterval(() => {
    setNow(new Date());
  }, 1000);

  const endTimeAsDate = new Date(endTime);
  const totalTime = endTime - startTime;
  const currentTime = now.getTime();
  const progress = currentTime - startTime;
  const percent = Math.round((progress / totalTime) * 100);
  const normalizedPercent = (percent < 100 && percent >= 0) ? percent : 100;
  const timeRemaining = intervalToDuration({
    start: now,
    end: endTimeAsDate,
  });
  const timeRemainingString = formatDuration(timeRemaining)
    .replace(/(year)s?/, "y")
    .replace(/(month)s?/, "mo")
    .replace(/(week)s?/, "w")
    .replace(/(day)s?/, "d")
    .replace(/(hour)s?/, "h")
    .replace(/(minute)s?/, "m")
    .replace(/(second)s?/, "s");

  const isEnded = endTimeAsDate < now;

  const isTextRed =
    !timeRemaining.hours || timeRemaining.hours === 0 || isEnded;

  return (
    <Wrapper>
      <Text
        style={
          {
            "--color": isTextRed ? "var(--red-500)" : "var(--dark-text)",
            "--font-size": fontSize !== undefined ? `${fontSize}px` : "16px",
            "--margin-bottom":
              marginBottom !== undefined ? `${marginBottom}px` : "8px",
          } as CSSProperties
        }
      >
        {isEnded ? "Ended" : timeRemainingString}
      </Text>
      <_Root value={normalizedPercent}>
        <_Indicator
          style={{ transform: `translateX(-${100 - normalizedPercent}%)` }}
        />
      </_Root>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Text = styled.p`
  margin-bottom: var(--margin-bottom);
  font: var(--body-sm);
  font-size: var(--font-size);
  color: var(--color);
`;

const barStyle = css`
  position: relative;
  overflow: hidden;
  background: var(--grey-500);
  width: 100%;
  height: 3px;
  border-radius: 2px;

  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: translateZ(0);
`;

const _Root = styled(Root)`
  ${barStyle}
  background: var(--grey-500);
`;

const _Indicator = styled(Indicator)`
  ${barStyle}
  background: var(--red-500);
`;
