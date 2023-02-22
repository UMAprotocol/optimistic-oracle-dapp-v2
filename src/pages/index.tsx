import { Filters, Layout, OracleQueries } from "@/components";
import { useOracleDataContext } from "@/hooks";
import { mockFilters } from "@/stories/mocks";
import type { OracleQueryUI } from "@/types";
import { useEffect, useState } from "react";

export default function Verify() {
  const { verify } = useOracleDataContext();
  const [queries, setQueries] = useState<OracleQueryUI[]>([]);

  useEffect(() => {
    if (verify) {
      setQueries(verify);
    }
  }, [verify]);

  function getFilteredQueries() {
    const filters = {
      chainName: ["Ethereum", "Boba"],
      project: ["UMA"],
      oracleType: ["Skinny Optimistic Oracle"],
    };

    const result = [];

    for (const query of queries) {
      let passes = true;

      for (const [filter, values] of Object.entries(filters)) {
        const _filter = filter as keyof typeof filters;
        if (values.length && !values.includes(query[_filter])) {
          passes = false;
        }
      }

      if (passes) {
        result.push(query);
      }
    }

    return result;
  }

  return (
    <Layout>
      <Filters
        {...mockFilters}
        dataSet={verify ?? []}
        setResults={setQueries}
      />
      <OracleQueries
        queries={getFilteredQueries()}
        isLoading={verify === undefined}
        page="verify"
      />
    </Layout>
  );
}
