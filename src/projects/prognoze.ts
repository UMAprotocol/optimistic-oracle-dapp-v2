import { Project } from "./abstract";

export class PrognozeProject extends Project<"Prognoze"> {
  constructor() {
    super({
      name: "Prognoze",
      requesters: ["0x437d2ed00c7d6d6c8401c7b810b51b422593c22b"],
      identifiers: ["MULTIPLE_CHOICE_QUERY"],
    });
  }
}
