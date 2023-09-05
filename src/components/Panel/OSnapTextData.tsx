import assert from "assert";
import { SectionSubTitle, Link } from "./style";
import { AdditionalTextData } from "./AdditionalTextData";
import useSWR from "swr";

interface Props {
  description: string | undefined;
  queryText: string | undefined;
  queryTextHex: string | undefined;
}
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
  // eslint-disable-next-line
  const title = (ipfsData as any)?.data?.message?.title;
  // eslint-disable-next-line
  const space = (ipfsData as any)?.data?.message?.space;
  // eslint-disable-next-line
  const hash = (ipfsData as any)?.hash;

  if (space && hash) {
    return {
      link: `https://snapshot.org/#/${space}/proposal/${hash}`,
      // eslint-disable-next-line
      title: title ?? space,
    };
  }
}

async function getIpfs(hash?: string) {
  if (!hash) return undefined;
  const response = await fetch(`https://snapshot.4everland.link/ipfs/${hash}`);
  return await response.json();
}
export function useIpfs(hash?: string) {
  return useSWR(`/ipfs/${hash}`, () => {
    assert(hash, "Missing ipfs hash");
    return getIpfs(hash);
  });
}
