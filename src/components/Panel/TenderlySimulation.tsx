import type { TenderlySimulationResult } from "@/helpers/tenderly";
import {
  exceedsOsnapGasSubsidy,
  simulateTransaction,
} from "@/helpers/tenderly";
import type { OsnapPluginData } from "@/types";
import { sleep } from "@libs/utils";
import { useState } from "react";

type SimulationProps = {
  safe: OsnapPluginData["oSnap"]["safe"];
};

type SimulationState =
  | {
      status: "SUCCESS";
      simulationLink: TenderlySimulationResult["resultUrl"];
      gasUsed: TenderlySimulationResult["gasUsed"];
      exceedsGasSubsidy: boolean;
    }
  | {
      status: "FAIL";
      simulationLink: TenderlySimulationResult["resultUrl"];
      gasUsed: TenderlySimulationResult["gasUsed"];
      exceedsGasSubsidy: boolean;
    }
  | {
      status: "ERROR";
      error: string;
    }
  | {
      status: "LOADING";
    }
  | {
      status: "IDLE";
    };

export function TenderlySimulation({ safe }: SimulationProps) {
  const [status, setStatus] = useState<SimulationState>({ status: "IDLE" });

  function handleSimulationResult(res: TenderlySimulationResult) {
    // if gas exceeds osnap gas subsidy, tx will not be automatically executed
    const exceedsGasSubsidy = exceedsOsnapGasSubsidy(res);

    if (res.status === true) {
      setStatus({
        status: "SUCCESS",
        simulationLink: res.resultUrl,
        gasUsed: res.gasUsed,
        exceedsGasSubsidy,
      });
    } else {
      setStatus({
        status: "FAIL",
        simulationLink: res.resultUrl,
        gasUsed: res.gasUsed,
        exceedsGasSubsidy,
      });
    }
  }

  async function simulate() {
    try {
      setStatus({ status: "LOADING" });
      const response = await simulateTransaction(safe);
      handleSimulationResult(response);
    } catch (error) {
      setStatus({
        status: "ERROR",
        error: error instanceof Error ? error.message : "Failed to simulate!",
      });
    } finally {
      await sleep(5000);
      setStatus({ status: "IDLE" });
    }
  }

  return (
    <div>
      <button onClick={void simulate}>Simulate!</button>
      <pre lang="json">{JSON.stringify(status)}</pre>
    </div>
  );
}
