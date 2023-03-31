import type { utils } from "@uma/sdk";
export type BatchReadWithErrorsType = ReturnType<
  ReturnType<typeof utils.BatchReadWithErrors>
>;
