import { getProjectIcon } from "@/constants";
import type { Project } from "@shared/types";
import { CloseButton } from "../CloseButton";
import { LoadingSkeleton } from "../LoadingSkeleton";
import { TruncatedTitle } from "../TruncatedTitle";

type Props = {
  title?: string;
  project?: Project;
  isLoading: boolean;
  close: () => void;
};
export function Title({ project, title, isLoading, close }: Props) {
  const ProjectIcon = getProjectIcon(project);

  const buttonMinWidth = "1rem";
  const buttonMaxWidth = "1.25rem";
  const buttonPreferredWidth = "calc(0.9rem + 0.4vw)";
  const buttonClampedWidth = `clamp(${buttonMinWidth}, ${buttonPreferredWidth}, ${buttonMaxWidth})`;

  const iconStyles =
    "min-w-[1.25rem] w-[clamp(1.25rem,0.8rem+2vw,2.5rem)] h-[clamp(1.25rem,0.8rem+2vw,2.5rem)]";
  return (
    <div className="grid grid-cols-[auto,1fr,auto] gap-page-padding min-h-[84px] px-page-padding lg:px-7 py-5 bg-blue-grey-700">
      {isLoading ? (
        <div className={iconStyles}>
          <LoadingSkeleton width="100%" height="100%" borderRadius="50%" />
        </div>
      ) : (
        <ProjectIcon className={iconStyles} />
      )}
      <h1 className="max-w-[400px] text-lg text-light" id="panel-title">
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
