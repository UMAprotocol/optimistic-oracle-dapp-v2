import { Project } from "./abstract";

export class CozyFinanceProject extends Project<"Cozy Finance"> {
  constructor() {
    super({
      name: "Cozy Finance",
      identifiers: ["YES_OR_NO_QUERY"],
      requiredTokens: {
        YES_OR_NO_QUERY: ["This will revert if a non-YES answer is proposed."],
      },
    });
  }
}
