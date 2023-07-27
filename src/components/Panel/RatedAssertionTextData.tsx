import { ratedAbi } from "@shared/constants/abi";
import { BigNumber } from "ethers";
import { useContractRead } from "wagmi";
import { SectionSubTitle, Text } from "./style";

type Props = {
  queryText: string;
};
export function RatedAssertionTextData(props: Props) {
  return (
    <>
      <SectionSubTitle>Report</SectionSubTitle>
      <Report queryText={props.queryText} />
      <SectionSubTitle>Violations</SectionSubTitle>
      <Violations queryText={props.queryText} />
    </>
  );
}

export function Report(props: Props) {
  const { data: report } = useContractRead({
    abi: ratedAbi,
    address: "0x1dd1ea5e2b3020f2564c8509b180ffc6fdf4fb8b",
    functionName: "reports",
    args: [BigNumber.from(props.queryText)],
  });
  if (!report) return null;
  const { fromEpoch, toEpoch, timestamp, assertionID } = report;

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
    address: "0x1dd1ea5e2b3020f2564c8509b180ffc6fdf4fb8b",
    functionName: "getViolationsInReport",
    args: [BigNumber.from(props.queryText)],
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
