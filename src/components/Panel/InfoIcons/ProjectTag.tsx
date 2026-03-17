import { PanelInfoIconText, PanelInfoIconWrapper } from "@/components/style";
import { getProjectIcon } from "@/constants";
import type { ProjectName } from "@/projects";

/**
 * Displays a tag for the given project name.
 * @param project The project name to display a tag for.
 * @returns The tag for the given project, or null if the project is unknown or undefined.
 */
export function ProjectTag({ project }: { project: ProjectName | undefined }) {
  if (!project || project === "Unknown") return null;

  const Icon = getProjectIcon(project);

  return (
    <PanelInfoIconWrapper>
      <Icon className="w-6 h-6" />
      <PanelInfoIconText>{project}</PanelInfoIconText>
    </PanelInfoIconWrapper>
  );
}
