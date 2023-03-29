import type { IdentifierDetails } from "@/types";
import approvedIdentifiersTable from "./approvedIdentifiersTable.json";

const approvedIdentifiers: Record<string, IdentifierDetails> =
  approvedIdentifiersTable;

export default approvedIdentifiers;
