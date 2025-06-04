import { Project } from "./abstract";

export class AcrossV2 extends Project<"Across"> {
  constructor() {
    super({
      name: "Across",
      privateIdentifiers: ["ACROSS-V2"],
    });
  }
}
