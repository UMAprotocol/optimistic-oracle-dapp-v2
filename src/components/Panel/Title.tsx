import { getProjectIcon } from "@/constants";
import type { OracleQueryUI } from "@/types";
import { CloseButton } from "../CloseButton";
import { TruncatedTitle } from "../TruncatedTitle";

interface Props extends OracleQueryUI {
  close: () => void;
}
export function Title({ project, title, close }: Props) {
  const ProjectIcon = getProjectIcon(project);

  const buttonMinWidth = "1rem";
  const buttonMaxWidth = "1.25rem";
  const buttonPreferredWidth = "calc(0.9rem + 0.4vw)";
  const buttonClampedWidth = `clamp(${buttonMinWidth}, ${buttonPreferredWidth}, ${buttonMaxWidth})`;

  return (
    <div className="grid grid-cols-[auto,1fr,auto] gap-page-padding min-h-[84px] px-page-padding lg:px-7 py-5 bg-blue-grey-700">
      <ProjectIcon className="min-w-[1.25rem] w-[clamp(1.25rem,0.8rem+2vw,2.5rem)] h-[clamp(1.25rem,0.8rem+2vw,2.5rem)]" />
      <h1 className="max-w-[400px] text-lg text-light" id="panel-title">
        <TruncatedTitle title={title} />
      </h1>
      <div className="min-w-[1.25rem] w-[clamp(1.25rem,0.8rem+2vw,2.5rem)] h-[clamp(1.25rem,0.8rem+2vw,2.5rem)]">
        <CloseButton onClick={close} size={buttonClampedWidth} />
      </div>
    </div>
  );
}
