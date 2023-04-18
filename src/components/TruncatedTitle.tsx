import { Tooltip } from "@/components";
import { maxTitleLength } from "@/constants";
import styled from "styled-components";

interface Props {
  title: string | undefined;
}
export function TruncatedTitle({ title }: Props) {
  const titleIsTooLong = !!title && title.length > maxTitleLength;
  const truncatedTitle = titleIsTooLong
    ? `${title.slice(0, maxTitleLength)}...`
    : title;

  if (titleIsTooLong)
    return (
      <Tooltip content={title}>
        <TruncatedTitleWrapper>{truncatedTitle}</TruncatedTitleWrapper>
      </Tooltip>
    );

  return <TitleWrapper>{title}</TitleWrapper>;
}

const TitleWrapper = styled.span`
  word-break: break-all;
`;

const TruncatedTitleWrapper = styled(TitleWrapper)`
  cursor: pointer;
`;
