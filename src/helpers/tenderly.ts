import type { OsnapPluginData } from "@/types";
import { config } from "@/constants/env";

export type TenderlySimulationResult = {
  id: string;
  status: boolean; // True if the simulation succeeded, false if it reverted.
  gasUsed: number;
  resultUrl: {
    url: string; // This is the URL to the simulation result page (public or private).
    public: boolean; // This is false if the project is not publicly accessible.
  };
};

export const OSNAP_GAS_SUBSIDY = 500_000;

export async function simulateTransaction(safeData: OsnapPluginData["oSnap"]) {
  const response = await fetch(config.simulationEndpoint, {
    headers: new Headers({
      "content-type": "application/json",
    }),
    method: "POST",
    body: JSON.stringify(safeData),
  });

  if (!response.ok) {
    throw new Error("Error running simulation");
  }

  return (await response.json()) as TenderlySimulationResult;
}

export function exceedsOsnapGasSubsidy(res: TenderlySimulationResult): boolean {
  return res.gasUsed > OSNAP_GAS_SUBSIDY;
}
