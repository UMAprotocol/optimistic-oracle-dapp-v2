import type { PageName } from "@shared/types";

interface Props {
  page: PageName;
}

export function NoQueries({ page }: Props) {
  return <div>{page}</div>;
}
