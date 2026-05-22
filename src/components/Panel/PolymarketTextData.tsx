import { SectionSubTitle, Text } from "./style";
import { AdditionalTextData } from "./AdditionalTextData";
import { useContractReads, type Address } from "wagmi";
import { polymarketBulletinAbi } from "@shared/constants/abi";
import { utils } from "ethers";
import { isWagmiAddress, toUtcTimeFormatted } from "@/helpers";
import { getInitializerAddress } from "@/helpers/queryParsing";
import {
  getBulletinOwnerQueries,
  mergePolymarketBulletinUpdates,
  type RawPolymarketBulletinUpdate,
} from "@/projects/polymarketBulletinOwners";

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
  const ownerAddress = getInitializerAddress(description);
  const ownerQueries = ownerAddress
    ? getBulletinOwnerQueries(ownerAddress)
    : [];

  return useContractReads({
    allowFailure: false,
    contracts: ownerQueries.map((ownerQuery) => ({
      address,
      abi: polymarketBulletinAbi,
      functionName: "getUpdates",
      // bulletin contract on polygon
      chainId: 137,
      args: [questionId as Address, ownerQuery.owner],
    })),
    enabled: !!address && !!questionId && !!ownerAddress,
    select: (updatesByOwner) =>
      mergePolymarketBulletinUpdates(
        updatesByOwner as RawPolymarketBulletinUpdate[][],
        ownerQueries,
      ),
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
  return (
    <>
      {bulletinUpdates?.data?.length ? (
        <>
          <SectionSubTitle>Polymarket Bulletin Board</SectionSubTitle>
          {bulletinUpdates.data.map((data, index) => {
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
