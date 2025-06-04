import { Project } from "./abstract";

export class SherlockProject extends Project<"Sherlock"> {
  constructor() {
    super({
      name: "Sherlock",
      privateIdentifiers: ["SHERLOCK_CLAIM"],
    });
  }
}
