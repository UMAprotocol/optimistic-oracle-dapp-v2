import { useEffectOnce } from "usehooks-ts";
import { useFilterAndSearchContext } from "./contexts";
import { useUrlBar } from "./useUrlBar";

export function useFiltersInSearchParams() {
  const { setSearchTerm, overrideCheckedFilters } = useFilterAndSearchContext();
  const { searchParams } = useUrlBar();

  useEffectOnce(() => {
    if (!searchParams) return;

    const hasSearch = searchParams?.has("search");

    if (hasSearch) {
      setSearchTerm(searchParams.get("search")!);
    }

    const hasChainName = searchParams?.has("chainName");
    const hasProject = searchParams?.has("project");
    const hasOracleType = searchParams?.has("oracleType");

    if (hasChainName || hasProject || hasOracleType) {
      overrideCheckedFilters({
        chainName: searchParams.getAll("chainName")!,
        project: searchParams.getAll("project")!,
        oracleType: searchParams.getAll("oracleType")!,
      });
    }
  });
}
