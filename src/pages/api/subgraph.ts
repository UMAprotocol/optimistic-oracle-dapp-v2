import type { NextApiRequest, NextApiResponse } from "next";

import { fetchAllRequests } from "@libs/oracle-sdk-v2/services/oraclev1/gql/queries";
import type { OracleType } from "@shared/types";

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse,
) {
  response.setHeader("Cache-Control", "max-age=0, s-maxage=43200"); // Cache for 12 hours, reset on re-deployment.

  if (
    !_request.query.url ||
    !_request.query.queryName ||
    !_request.query.oracleType ||
    !_request.query.until
  ) {
    response.status(400).send({
      message: "Missing required parameters",
    });
    return;
  }

  const until = Number(_request.query.until);

  if (
    until < 0 ||
    isNaN(until) ||
    until > Math.round(Date.now() / 1000) - 600
  ) {
    response.status(400).send({
      message: "Invalid until parameter",
    });
    return;
  }

  const requests = await fetchAllRequests(
    _request.query.url as string,
    _request.query.queryName as string,
    _request.query.oracleType as OracleType,
  );

  const filteredRequests = requests.filter(
    (request) => Number(request.time) <= until,
  );

  response.status(200).send(filteredRequests);
}
