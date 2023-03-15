import { Filters, Layout, OracleQueries } from "@/components";
import { usePage } from "@/hooks";

export default function Verify() {
  const page = usePage("verify");
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
