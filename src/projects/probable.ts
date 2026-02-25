import { Project } from "./abstract";

export class ProbableProject extends Project<"Probable"> {
  constructor() {
    super({
      name: "Probable",
      identifiers: ["YES_OR_NO_QUERY"],
      requesters: ["0xa68F6B97f605f22ba6A8420460dafB5B5BC35A20"],
    });
  }
}
