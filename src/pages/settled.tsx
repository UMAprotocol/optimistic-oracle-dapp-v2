import { OracleQueries } from "@/components";
import { usePage } from "@/hooks";

export default function Settled() {
  const page = "settled";
  usePage(page);
  return <OracleQueries page={page} />;
}
