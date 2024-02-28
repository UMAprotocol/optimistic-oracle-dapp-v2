import { ratedAbi } from "@shared/constants/abi";
import type { ChainId } from "@shared/types";
import { useContractRead } from "wagmi";
import { SectionSubTitle, Text } from "./style";

const mainnetAddress = "0x51881A1Cde5DBAE15D02aE1824940b19768d8F2b";
const goerliAddress = "0x1dd1ea5e2b3020f2564c8509b180ffc6fdf4fb8b";

type Props = {
  queryText: string;
  chainId: ChainId;
};
export function RatedAssertionTextData(props: Props) {
  return (
    <>
      <SectionSubTitle>Report #{props.queryText}</SectionSubTitle>
      <Report {...props} />
      <SectionSubTitle>Violations</SectionSubTitle>
      <Violations {...props} />
    </>
  );
}

export function Report(props: Props) {
  const { data: report } = useContractRead({
    abi: ratedAbi,
    address: props.chainId === 1 ? mainnetAddress : goerliAddress,
    functionName: "reports",
    chainId: props.chainId,
    args: [BigInt(props.queryText)],
  });
  if (!report) return null;
  const [fromEpoch, toEpoch, timestamp, assertionID] = report;

  return (
    <div>
      <Text>
        <strong>From Epoch:</strong> {fromEpoch}
      </Text>
      <Text>
        <strong>To Epoch:</strong> {toEpoch}
      </Text>
      <Text>
        <strong>Timestamp:</strong> {timestamp.toString()}
      </Text>
      <Text>
        <strong>Assertion ID:</strong> {assertionID}
      </Text>
    </div>
  );
}

export function Violations(props: Props) {
  const { data: violations } = useContractRead({
    abi: ratedAbi,
    address: props.chainId === 1 ? mainnetAddress : goerliAddress,
    chainId: props.chainId,
    functionName: "getViolationsInReport",
    args: [BigInt(props.queryText)],
  });
  if (!violations) return null;

  if (violations.length === 0) {
    return (
      <div>
        <Text>This report contains no violations</Text>
      </div>
    );
  }

  return (
    <div>
      {violations.map((violation, i) => (
        <div key={i}>
          <Text>
            <strong>Validator identifier:</strong>{" "}
            {violation.validatorIdentifier}
          </Text>
          <Text>
            <strong>Epoch:</strong> {violation.epochNumber}
          </Text>
          <Text>
            <strong>Penalty type:</strong> {violation.penaltyType}
          </Text>
          <Text>
            <strong>New fee recipient address:</strong>{" "}
            {violation.newFeeRecipientAddress}
          </Text>
        </div>
      ))}
    </div>
  );
}
