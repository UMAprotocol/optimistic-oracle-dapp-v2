import { Filters, Layout, OracleQueries } from "@/components";
import { usePage } from "@/hooks";

const pageName = "verify";
export default function Verify() {
  const page = usePage(pageName);
  return (
    <Layout>
      <Filters {...page.filterProps} {...page.searchProps} />
      <OracleQueries
        queries={page.results}
        isLoading={page.isLoading}
        page={page.name}
      />
    </Layout>
  );
}
