import { darkText, red500 } from "@/constants";
import { Indicator, Root } from "@radix-ui/react-progress";
import { intervalToDuration } from "date-fns";
import { BigNumber } from "ethers";
import { useState } from "react";
import styled, { css, CSSProperties } from "styled-components";
import { useInterval } from "usehooks-ts";

interface Props {
  assertionTime: BigNumber;
  expirationTime: BigNumber;
}
export function LivenessProgressBar({ assertionTime, expirationTime }: Props) {
  const [now, setNow] = useState(new Date());

  useInterval(() => {
    setNow(new Date());
  }, 1000);

  const assertionTimeMilliseconds = assertionTime.toNumber() * 1000;
  const expirationTimeMilliseconds = expirationTime.toNumber() * 1000;
  const expirationTimeAsDate = new Date(expirationTimeMilliseconds);
  const totalTime = expirationTimeMilliseconds - assertionTimeMilliseconds;
  const currentTime = now.getTime();
  const progress = currentTime - assertionTimeMilliseconds;
  const percent = Math.round((progress / totalTime) * 100);
  const timeRemaining = intervalToDuration({
    start: now,
    end: expirationTimeAsDate,
  });
  const { hours, minutes, seconds } = timeRemaining;
  const timeRemainingString = `${hours && hours > 0 ? `${hours} h ` : ""}${
    minutes && minutes > 0 ? `${minutes} m ` : ""
  }${seconds ?? 0} s`;
  const isTextRed = !hours || hours === 0;

  if (expirationTimeAsDate < now) return null;

  return (
    <Wrapper>
      <Text
        style={
          {
            "--color": isTextRed ? red500 : darkText,
          } as CSSProperties
        }
      >
        {timeRemainingString}
      </Text>
      <_Root value={percent}>
        <_Indicator style={{ transform: `translateX(-${100 - percent}%)` }} />
      </_Root>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Text = styled.p`
  margin-bottom: 8px;
  font: var(--body-sm);
  color: var(--color);
`;

const barStyle = css`
  position: relative;
  overflow: hidden;
  background: var(--grey-500);
  width: min(160px, 100%);
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
