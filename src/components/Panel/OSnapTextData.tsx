import { SectionSubTitle, Link } from "./style";
import { AdditionalTextData } from "./AdditionalTextData";
import {
  getOsnapProposalPluginData,
  snapshotProposalLink,
  useIpfs,
} from "@/helpers/snapshot";
import { TenderlySimulation } from "./TenderlySimulation";

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
  const osnapData = getOsnapProposalPluginData(ipfs?.data);
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
      {osnapData && <TenderlySimulation safe={osnapData.oSnap.safe} />}
      <AdditionalTextData {...props} />
    </>
  );
}
