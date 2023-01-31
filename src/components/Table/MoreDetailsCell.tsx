import { Button } from "@/components";
import { Request } from "@/types";
import { TD } from "./style";

export function MoreDetailsCell({ request }: { request: Request }) {
  return (
    <TD>
      <Button
        onClick={() => alert(JSON.stringify(request))}
        label="More details"
      />
    </TD>
  );
}
