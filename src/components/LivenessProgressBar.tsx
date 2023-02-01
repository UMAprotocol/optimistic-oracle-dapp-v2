import { Indicator, Root } from "@radix-ui/react-progress";
import { intervalToDuration } from "date-fns";
import { BigNumber } from "ethers";
import { useState } from "react";
import styled from "styled-components";
import { useInterval } from "usehooks-ts";

export function LivenessProgressBar({
  assertionTime,
  expirationTime,
}: {
  assertionTime: BigNumber;
  expirationTime: BigNumber;
}) {
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

  if (expirationTimeAsDate < now) return null;

  return (
    <Wrapper>
      {timeRemainingString}
      <_Root value={percent}>
        <_Indicator style={{ transform: `translateX(-${100 - percent}%)` }} />
      </_Root>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const _Root = styled(Root)`
  position: relative;
  overflow: hidden;
  background: var(--grey-500);
  width: 300px;
  height: 25px;

  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: translateZ(0);
`;

const _Indicator = styled(Indicator)`
  position: relative;
  overflow: hidden;
  background: var(--red-500);
  width: 300px;
  height: 25px;

  /* Fix overflow clipping in Safari */
  /* https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0 */
  transform: translateZ(0);
`;
