import { Tooltip } from "@/components";
import { maxTitleLength } from "@/constants";
import removeMarkdown from "remove-markdown";
import styled from "styled-components";

interface Props {
  title: string | undefined;
}
export function TruncatedTitle({ title: maybeMarkdownTitle }: Props) {
  const title = maybeMarkdownTitle
    ? removeMarkdown(maybeMarkdownTitle)
    : undefined;
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
  overflow-wrap: anywhere;
`;

const TruncatedTitleWrapper = styled(TitleWrapper)`
  cursor: pointer;
`;
