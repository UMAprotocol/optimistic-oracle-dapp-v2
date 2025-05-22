import type { DropdownItem } from "@/types";
import * as s from "superstruct";
import type { ProjectName, Project } from "@/projects";
import { projects, validateProject } from "@/projects";
import { identifiers } from "@/identifiers";

// Define MetaData type here for this file
export type MetaData = {
  title: string;
  description: string;
  umipUrl?: string;
  umipNumber?: string;
  proposeOptions?: DropdownItem[];
  project: ProjectName;
};

export function isOptimisticGovernor(decodedAncillaryData: string) {
  return validateProject(projects.oSnap, {
    decodedAncillaryData,
  });
}

export function getQueryMetaData(
  decodedIdentifier: string,
  decodedAncillaryData: string,
  requester: string,
): MetaData {
  // Step 1: Find the matching project
  const project = Object.values(projects).find((project) => {
    return validateProject(project, {
      requester,
      decodedIdentifier,
      decodedAncillaryData,
    });
  });

  // Get project name, defaulting to "Unknown" if not found
  const projectName = project?.name || "Unknown";

  //  Use the identifier system to get metadata
  const identifier = identifiers.getIdentifierByName(decodedIdentifier);

  // Get metadata from the identifier
  const metadata = identifier.getMetaData(decodedAncillaryData);

  // Try to get project-specific options first, then for identifier
  const proposeOptions =
    (project as Project)?.makeProposeOptions?.(
      decodedAncillaryData,
      decodedIdentifier,
    ) ?? identifier.makeProposeOptions(decodedAncillaryData);

  return {
    ...metadata,
    proposeOptions,
    project: projectName,
  };
}
//this is for the markets already created without title identifier
// ! we don't want to support malformed requests
// export function polybetGetTitleIfNoTitleIdentifier(
//   decodedAncillaryData: string
// ) {
//   const questionIndex = decodedAncillaryData.indexOf("?");
//   const substring = decodedAncillaryData.substring(0, questionIndex + 1);
//   return substring;
// }

export function getTitleAndDescriptionFromTokens(
  decodedAncillaryData: string,
  titleIdentifier = "title:",
  descriptionIdentifier = "description:",
): { title: string | undefined; description: string | undefined } {
  try {
    const titleStart = decodedAncillaryData.indexOf(titleIdentifier);
    const descriptionStart = decodedAncillaryData.indexOf(
      descriptionIdentifier,
    );

    let title: string | undefined = undefined;
    let description: string | undefined = undefined;

    // Extract title if found
    if (titleStart !== -1) {
      const titleContentStart = titleStart + titleIdentifier.length;
      const titleEnd =
        descriptionStart !== -1
          ? descriptionStart
          : decodedAncillaryData.length;
      title = decodedAncillaryData
        .substring(titleContentStart, titleEnd)
        .trim();
      // Remove trailing comma if it exists (from Polymarket)
      if (title.endsWith(",")) {
        title = title.slice(0, -1);
      }
    }

    // Extract description if found
    if (descriptionStart !== -1) {
      const descriptionContentStart =
        descriptionStart + descriptionIdentifier.length;
      description = decodedAncillaryData
        .substring(descriptionContentStart)
        .trim();
    }

    return { title, description };
  } catch (error) {
    console.error(
      "Failed to extract title and description using tokens",
      error,
    );
    return {
      title: undefined,
      description: undefined,
    };
  }
}

const OracleDetailsSchema = s.type({
  title: s.string(),
  description: s.string(),
});

type OracleDetailsSchemaT = s.Infer<typeof OracleDetailsSchema>;

export function getTitleAndDescriptionFromJson(
  decodedAncillaryData: string,
): OracleDetailsSchemaT | undefined {
  try {
    const endOfObjectIndex = decodedAncillaryData.lastIndexOf("}");
    const maybeJson =
      endOfObjectIndex > 0
        ? decodedAncillaryData.slice(0, endOfObjectIndex + 1)
        : decodedAncillaryData;

    const json = JSON.parse(maybeJson);

    const [error, data] = s.validate(json, OracleDetailsSchema);

    return error
      ? undefined
      : {
          title: data.title,
          description: data.description,
        };
  } catch (e) {
    // not json
    return undefined;
  }
}
