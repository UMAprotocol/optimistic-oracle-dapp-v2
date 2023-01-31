import { TD } from "./style";
import { Request } from "@/types";

export function ProposeRow({ type, bond, reward }: Request) {
  return (
    <>
      <TD>{type}</TD>
      <TD>{bond.toString()}</TD>
      <TD>{reward.toString()}</TD>
    </>
  );
}
