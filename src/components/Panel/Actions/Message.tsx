import { makeUrlParamsForQuery } from "@/helpers";
import type { OracleQueryUI } from "@/types";
import type { PageName } from "@shared/types";
import Warning from "public/assets/icons/warning.svg";
import { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "../style";

interface Props {
  query: OracleQueryUI;
  page: PageName;
  alreadySettled: boolean;
  alreadyProposed: boolean;
}
export function Message({
  query,
  page,
  alreadyProposed,
  alreadySettled,
}: Props) {
  const [message, setMessage] = useState<ReactNode>("");

  const hasMessage = message !== "";

  useEffect(() => {
    setMessage("");
    if (page === "settled") return;

    if (!alreadyProposed && !alreadySettled) return;

    const message = (
      <>
        This query has already been {alreadyProposed ? "proposed" : "settled"}.
        View it{" "}
        <Link
          href={{
            pathname: alreadyProposed ? "/" : "/settled",
            query: makeUrlParamsForQuery(query),
          }}
        >
          here.
        </Link>
      </>
    );

    setMessage(message);
  }, [page, query, alreadyProposed, alreadySettled]);

  if (!hasMessage) return null;

  return (
    <div className="w-panel-content-width min-h-[48px] flex items-center gap-4 mt-5 px-4 rounded-sm bg-blue-grey-500/5 border-2 border-blue-grey-500">
      <Warning className="[&>path]:fill-blue-grey-500" />
      <p className="text-xs sm:text-base text-blue-grey-500">{message}</p>
    </div>
  );
}
