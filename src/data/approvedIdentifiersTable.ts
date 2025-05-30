import type { IdentifierDetails } from "@/types";
import approvedIdentifiersTable from "./approvedIdentifiersTable.json";

const approvedIdentifiers = approvedIdentifiersTable as Record<
  string,
  IdentifierDetails
>;

export default approvedIdentifiers;
