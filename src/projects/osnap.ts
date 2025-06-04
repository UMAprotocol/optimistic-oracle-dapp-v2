import { Project } from "./abstract";

export class OSnapProject extends Project<"OSnap"> {
  constructor() {
    super({
      name: "OSnap",
      identifiers: ["MULTIPLE_CHOICE_QUERY"],
      requiredTokens: {
        MULTIPLE_CHOICE_QUERY: ["rules:", "explanation:"],
      },
    });
  }
}
