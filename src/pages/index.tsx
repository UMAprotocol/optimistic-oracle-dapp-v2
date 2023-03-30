import { OracleQueries } from "@/components";
import { usePage } from "@/hooks";

export default function Verify() {
  const page = "verify";
  usePage(page);
  return <OracleQueries page={page} />;
}
