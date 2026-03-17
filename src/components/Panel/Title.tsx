import { CloseButton } from "../CloseButton";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { TruncatedTitle } from "../TruncatedTitle";
import type { ProjectName } from "@/projects";

type Props = {
  title?: string;
  project?: ProjectName;
  isLoading: boolean;
  close: () => void;
};
export function Title({ title, isLoading, close }: Props) {
  const buttonMinWidth = "1rem";
  const buttonMaxWidth = "1.25rem";
  const buttonPreferredWidth = "calc(0.9rem + 0.4vw)";
  const buttonClampedWidth = `clamp(${buttonMinWidth}, ${buttonPreferredWidth}, ${buttonMaxWidth})`;

  const iconStyles =
    "min-w-[1.25rem] flex items-center justify-center w-[clamp(1.25rem,0.8rem+2vw,2.5rem)] h-[clamp(1.25rem,0.8rem+2vw,2.5rem)] rounded-full";
  return (
    <div className="grid grid-cols-[1fr,auto] content-center gap-page-padding min-h-[84px] px-page-padding lg:px-7 py-5 bg-blue-grey-700">
      <h1
        className="inline-flex items-center max-w-[400px] text-lg text-light"
        id="panel-title"
      >
        {isLoading ? (
          <LoadingSkeleton count={2} height={16} />
        ) : (
          <TruncatedTitle title={title} />
        )}
      </h1>
      <div className={iconStyles}>
        <CloseButton onClick={close} size={buttonClampedWidth} />
      </div>
    </div>
  );
}
