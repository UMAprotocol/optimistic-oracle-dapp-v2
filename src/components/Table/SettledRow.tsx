import { Request } from "@/types";
import { TD } from "./style";

export function SettledRow({ type, settledAs }: Request) {
  return (
    <>
      <TD>{type}</TD>
      <TD>{settledAs}</TD>
    </>
  );
}
