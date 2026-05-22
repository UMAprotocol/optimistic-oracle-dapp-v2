import { SectionSubTitle, Text } from "./style";
import { AdditionalTextData } from "./AdditionalTextData";
import { useContractReads, type Address } from "wagmi";
import { polymarketBulletinAbi } from "@shared/constants/abi";
import { utils } from "ethers";
import { isWagmiAddress, toUtcTimeFormatted } from "@/helpers";
import {
  getBulletinOwners,
  getInitializerAddress,
} from "@/helpers/queryParsing";

interface Props {
  description: string | undefined;
  queryText: string | undefined;
  queryTextHex: string | undefined;
}

function getPolymarketBulletinContractFromAncillaryData(
  queryText: string,
): Address | undefined {
  const regex =
    /Updates made by the question creator via the bulletin board at (0x[a-fA-F0-9]{40})/;
  const match = queryText.match(regex);
  if (isWagmiAddress(match?.[1])) return match?.[1];
  return undefined;
}

export function useGetUpdates(props: {
  queryTextHex: string | undefined;
  description: string | undefined;
  address: Address | undefined;
}) {
  const { queryTextHex, description, address } = props;
  const questionId = queryTextHex ? utils.keccak256(queryTextHex) : undefined;
  const initializer = getInitializerAddress(description);
  const owners = initializer ? getBulletinOwners(initializer) : [];

  return useContractReads({
    contracts: owners.map((owner) => ({
      address,
      abi: polymarketBulletinAbi,
      functionName: "getUpdates" as const,
      // bulletin contract on polygon
      chainId: 137,
      args: [questionId as Address, owner],
    })),
    enabled: !!address && !!questionId && owners.length > 0,
  });
}

export function PolymarketTextData(props: Props) {
  const bulletinAddress = props.queryText
    ? getPolymarketBulletinContractFromAncillaryData(props.queryText)
    : undefined;
  const bulletinUpdates = useGetUpdates({
    address: bulletinAddress,
    queryTextHex: props.queryTextHex,
    description: props.description,
  });
  const mergedUpdates = bulletinUpdates?.data
    ?.flatMap((result) => (result.status === "success" ? result.result : []))
    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
  return (
    <>
      {mergedUpdates?.length ? (
        <>
          <SectionSubTitle>Polymarket Bulletin Board</SectionSubTitle>
          {mergedUpdates.map((data, index) => {
            return (
              <Text key={`${data.timestamp.toString()}-${index}`}>
                {toUtcTimeFormatted(data.timestamp.toString())}:{" "}
                {utils.toUtf8String(data.update)}
              </Text>
            );
          })}
        </>
      ) : undefined}
      <AdditionalTextData {...props} />
    </>
  );
}
