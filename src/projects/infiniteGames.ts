import { Project } from "./abstract";

export class InfiniteGamesProject extends Project<"Infinite Games"> {
  constructor() {
    super({
      name: "Infinite Games",
      requesters: [
        "0x8edec74d4e93b69bb8b1d9ba888d498a58846cb5",
        "0x4cb80ebdcabc9420edd4b5a5b296bbc86848206d",
      ],
      identifiers: ["MULTIPLE_CHOICE_QUERY"],
    });
  }
}
