import { useEffectOnce } from "usehooks-ts";
import { useUrlBar } from "./useUrlBar";
import { useFilterAndSearchContext } from "./contexts";

export function useFiltersInSearchParams() {
  const { setSearchTerm } = useFilterAndSearchContext();
  const { searchParams } = useUrlBar();

  useEffectOnce(() => {
    if (!searchParams) return;

    const hasSearch = searchParams?.has("search");

    if (hasSearch) {
      setSearchTerm(searchParams.get("search")!);
    }
  });
}
