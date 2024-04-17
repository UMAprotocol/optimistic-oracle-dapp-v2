import type { TenderlySimulationResult } from "@/helpers/tenderly";
import {
  OSNAP_GAS_SUBSIDY,
  exceedsOsnapGasSubsidy,
  simulateTransaction,
} from "@/helpers/tenderly";
import type { OsnapPluginData } from "@/types";
import { sleep } from "@libs/utils";
import { useState } from "react";
import Tenderly from "public/assets/icons/tenderly.svg";
import { LoadingSpinner } from "../LoadingSpinner";
import ExternalLink from "public/assets/icons/external-link-2.svg";
import Refresh from "public/assets/icons/refresh.svg";
import { cn } from "@/helpers";
import { useOsnapPluginData } from "@/helpers/snapshot";
import Warning from "public/assets/icons/warning.svg";
import Link from "next/link";

type Props = {
  queryText: string | undefined;
};

export function SimulateIfOsnap({ queryText }: Props) {
  const pluginData = useOsnapPluginData(queryText);

  if (!pluginData) {
    return;
  }

  if (pluginData === "safeSnap") {
    return (
      <div className="text-sm flex items-start justify-start gap-1 py-1 w-panel-content-width">
        <div className="leading-6 h-6 w-6 flex items-center justify-center">
          <Warning className="h-[1em] w-[1em]" />
        </div>

        <p className="leading-6">
          Tenderly Simulation not available. Please migrate to the official{" "}
          <Link
            className="text-red-500 hover:underline "
            target="_blank"
            href="https://docs.uma.xyz/developers/osnap/osnap-configuration-parameters-1"
          >
            oSnap plugin.
          </Link>
        </p>
      </div>
    );
  }

  return <TenderlySimulation osnapPluginData={pluginData} />;
}

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

type SimulationProps = {
  osnapPluginData: OsnapPluginData["oSnap"];
};

function TenderlySimulation({ osnapPluginData }: SimulationProps) {
  const [status, setStatus] = useState<SimulationState>({
    status: "IDLE",
  });

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

  function resetSimulation() {
    setStatus({ status: "IDLE" });
  }

  async function simulate() {
    try {
      setStatus({ status: "LOADING" });
      const response = await simulateTransaction(osnapPluginData);
      handleSimulationResult(response);
    } catch (error) {
      setStatus({
        status: "ERROR",
        error: error instanceof Error ? error.message : "Failed to simulate!",
      });
      await sleep(5000);
      setStatus({ status: "IDLE" });
    }
  }

  return (
    <div className="w-panel-content-width mt-2 ">
      {!(status.status === "SUCCESS" || status.status === "FAIL") ? (
        <button
          disabled={status.status === "LOADING"}
          className="hover:border-dark/50 disabled:text-dark/60 disabled:border-dark/20 text-dark h-12 w-full px-4 rounded-md flex justify-center items-center gap-2 bg-grey-100 border border-grey-200"
          onClick={() => void simulate()}
        >
          <Tenderly className="inline w-[21px] h-[21px]" />
          {status.status === "IDLE" && <span>Simulate Transaction</span>}
          {status.status === "LOADING" && (
            <>
              Checking transaction...
              <span className="ml-auto">
                <LoadingSpinner variant="black" width={18} height={18} />
              </span>
            </>
          )}
          {status.status === "ERROR" && <span>{status.error}</span>}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div
            className={cn("flex flex-col gap-2 border rounded-md", {
              "border-green-200 bg-green-100 text-green-600":
                status.status === "SUCCESS",
              "border-red-error-200 bg-red-error-100 text-red-error-600":
                status.status === "FAIL",
            })}
          >
            <div className="flex w-full justify-between h-[48px] px-4 items-center rounded-full">
              <div className="flex items-center gap-2">
                <Tenderly className="inline w-[21px] h-[21px]" />
                {status.status === "SUCCESS" && <span>Success!</span>}
                {status.status === "FAIL" && <span>Transaction failed!</span>}
              </div>
              {status.simulationLink.public ? (
                <a
                  className="flex items-center gap-1 text-inherit hover:underline"
                  target="_blank"
                  href={status.simulationLink.url}
                >
                  <span>View on Tenderly</span>
                  <ExternalLink className="w-4 h-4 inline" />
                </a>
              ) : (
                <div className="text-inherit">Simulation not public</div>
              )}
            </div>
          </div>

          <button
            onClick={resetSimulation}
            className="border border-dark/50 hover:border-dark rounded-md h-[48px] px-4 group hover:cursor-pointer justify-center w-full flex gap-2 mx-auto items-center"
          >
            Reset Simulation
            <Refresh className="text-inherit w-[1em] h-[1em]" />
          </button>

          {status.exceedsGasSubsidy && (
            <p className="text-sm text-left">
              <strong className="text-skins text-base text-red">
                Warning:{" "}
              </strong>
              This transaction will{" "}
              <strong className="underline">
                not be automatically executed by oSnap.
              </strong>
              This transaction used {status.gasUsed.toLocaleString()} gas, which
              exceeds oSnap&apos;s maximum subsidized amount of{" "}
              {OSNAP_GAS_SUBSIDY.toLocaleString()}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
