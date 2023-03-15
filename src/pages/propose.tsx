import { Filters, Layout, OracleQueries } from "@/components";
import { usePage } from "@/hooks";

export default function Propose() {
  const page = usePage("propose");
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
