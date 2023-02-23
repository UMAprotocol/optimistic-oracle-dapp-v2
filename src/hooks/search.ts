import Fuse from "fuse.js";
import { useMemo, useState } from "react";

interface Props<Data> {
  dataSet: Data[];
  keys: string[];
}
export function useSearch<Data>({ dataSet, keys }: Props<Data>) {
  const [searchTerm, setSearchTerm] = useState("");

  const scoreThreshold = 0.4;

  const fuse = useMemo(() => {
    const options = {
      includeScore: true,
      keys,
    };

    return new Fuse(dataSet, options);
  }, [dataSet, keys]);

  const results = useMemo(() => {
    if (!searchTerm) return dataSet;

    const results = fuse.search(searchTerm);

    return results
      .filter((result) => !!result.score && result.score < scoreThreshold)
      .map((result) => result.item);
  }, [dataSet, fuse, searchTerm]);

  return {
    results,
    searchTerm,
    setSearchTerm,
  };
}
