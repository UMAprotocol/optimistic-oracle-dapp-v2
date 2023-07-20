"use client";

import { OracleQueries } from "@/components";
import { usePage } from "@/hooks";

export default function Propose() {
  const page = "propose";
  usePage(page);
  return <OracleQueries page={page} />;
}
