import type { Project as ProjectType } from "./abstract";
import { AcrossV2 } from "./across";
import { CozyFinanceProject } from "./cozyFinance";
import { InfiniteGamesProject } from "./infiniteGames";
import { MetaMarketProject } from "./metaMarket";
import { OSnapProject } from "./osnap";
import { PolyBetProject } from "./polybet";
import { PolymarketProject } from "./polymarket";
import { PredictFunProject } from "./predictFun";
import { PrognozeProject } from "./prognoze";
import { RatedProject } from "./rated";
import { SherlockProject } from "./sherlock";
import { ProbableProject } from "./probable";

export const projects = {
  across: new AcrossV2(),
  cozyFinance: new CozyFinanceProject(),
  infiniteGames: new InfiniteGamesProject(),
  metaMarket: new MetaMarketProject(),
  oSnap: new OSnapProject(),
  polyBet: new PolyBetProject(),
  polymarket: new PolymarketProject(),
  predictFun: new PredictFunProject(),
  prognoze: new PrognozeProject(),
  rated: new RatedProject(),
  sherlock: new SherlockProject(),
  probable: new ProbableProject(),
  // register more projects here
};

export type ProjectName =
  | (typeof projects)[keyof typeof projects]["name"]
  | "Unknown";

type ProjectT = ProjectType<ProjectName>;

export type { ProjectT as Project };
