import { Tooltip } from "@/components";
import { maxTitleLength } from "@/constants";
import removeMarkdown from "remove-markdown";

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
        <span className="break-all cursor-pointer">{truncatedTitle}</span>
      </Tooltip>
    );

  return <span className="break-all">{title}</span>;
}
