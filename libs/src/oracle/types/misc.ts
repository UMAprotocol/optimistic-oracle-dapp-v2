import { utils } from "@uma/sdk";
export type BatchReadWithErrorsType = ReturnType<
  ReturnType<typeof utils.BatchReadWithErrors>
>;
