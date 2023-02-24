import type { OracleQueryUI } from "@/types";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";

interface Props {
  queries: OracleQueryUI[];
  keys: string[];
}
export function useSearch({ queries, keys }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(queries, { keys });
  }, [queries, keys]);

  const searchResults = useMemo(() => {
    if (!searchTerm) return queries;

    const results = fuse.search(searchTerm);

    return results.map((result) => result.item);
  }, [queries, fuse, searchTerm]);

  return {
    searchResults,
    searchTerm,
    setSearchTerm,
  };
}
