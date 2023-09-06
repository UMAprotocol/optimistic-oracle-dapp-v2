import assert from "assert";
import { SectionSubTitle, Link } from "./style";
import { AdditionalTextData } from "./AdditionalTextData";
import useSWR from "swr";

interface Props {
  description: string | undefined;
  queryText: string | undefined;
  queryTextHex: string | undefined;
}
// This represents the data we are able to parse from snapshot ipfs proposal
// Actual data could diverge from this, so we make everything partial.
type SnapshotData = Partial<{
  data: Partial<{
    message: Partial<{
      title: string;
      space: string;
    }>;
  }>;
  hash: string;
}>;
export function OSnapTextData(props: Props) {
  const explanationRegex = props.queryText
    ? props.queryText.match(/explanation:"(.*?)",rules:/)
    : undefined;
  const ipfs = useIpfs(explanationRegex ? explanationRegex[1] : undefined);
  const snapshotLink = snapshotProposalLink(ipfs?.data);
  return (
    <>
      {snapshotLink ? (
        <div>
          <SectionSubTitle>Proposal</SectionSubTitle>
          <Link target="_blank" href={snapshotLink.link}>
            {snapshotLink.title}
          </Link>
        </div>
      ) : undefined}
      <AdditionalTextData {...props} />
    </>
  );
}

function snapshotProposalLink(ipfsData: unknown) {
  // casting this to expected snapshot type
  const snapshotData = ipfsData as SnapshotData;
  const title = snapshotData?.data?.message?.title;
  const space = snapshotData?.data?.message?.space;
  const hash = snapshotData?.hash;

  if (space && hash) {
    return {
      link: `https://snapshot.org/#/${space}/proposal/${hash}`,
      title: title ?? space,
    };
  }
}

async function getIpfs(hash?: string) {
  if (!hash) return undefined;
  // could also use ipfs.io/ipfs, but this may be more reliable
  const response = await fetch(`https://snapshot.4everland.link/ipfs/${hash}`);
  return await response.json();
}
export function useIpfs(hash?: string) {
  return useSWR(`/ipfs/${hash}`, () => {
    assert(hash, "Missing ipfs hash");
    return getIpfs(hash);
  });
}
