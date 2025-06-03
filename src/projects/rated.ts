import { Project } from "./abstract";

export class RatedProject extends Project<"Rated"> {
  constructor() {
    super({
      name: "Rated",
      privateIdentifiers: ["ROPU_ETHx"],
    });
  }
}
