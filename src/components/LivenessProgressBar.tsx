import { intervalToDuration } from "date-fns";
import { BigNumber } from "ethers";

export function LivenessProgressBar({ liveness }: { liveness: BigNumber }) {
  const livenessEndsMilliseconds = liveness.toNumber() * 1000;
  const livenessEndsDate = new Date(livenessEndsMilliseconds);
  const livenessEndsDuration = intervalToDuration({
    start: new Date(),
    end: livenessEndsDate,
  });
  const { hours, minutes, seconds } = livenessEndsDuration;
  const livenessEndsFormatted = `${hours && hours !== 0 ? `${hours} h ` : ""}${
    minutes && minutes !== 0 ? `${minutes} min ` : ""
  }${seconds ?? 0} sec`;
  return <div>{livenessEndsFormatted}</div>;
}
