import { Request } from "@/types";
import { TD } from "./style";

export function VerifyRow({ proposal, challengePeriodEnd }: Request) {
  return (
    <>
      <TD>{proposal}</TD>
      <TD>{challengePeriodEnd.toString()}</TD>
    </>
  );
}
