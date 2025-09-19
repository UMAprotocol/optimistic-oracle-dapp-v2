import type { NextApiRequest, NextApiResponse } from "next";

import { fetchAllRequests } from "@libs/oracle-sdk-v2/services/oraclev1/gql/queries";
import type { OracleType } from "@shared/types";

import { oracleTypes } from "@shared/constants";
import { kv } from "@vercel/kv";
import { put } from "@vercel/blob";
import { waitUntil } from "@vercel/functions";

type BlobValue = {
  url: string;
  createdAt: number;
};

async function updateBlob(
  blobName: string,
  url: string,
  queryName: string,
  oracleType: OracleType,
) {
  const uuid = crypto.randomUUID();
  const requests = await fetchAllRequests(url, queryName, oracleType);
  const blobPath = `${blobName}-${uuid}.json`;
  const { url: blobUrl } = await put(blobPath, JSON.stringify(requests), {
    access: "public",
    addRandomSuffix: false,
  });
  await kv.set(
    blobName,
    JSON.stringify({
      url: blobUrl,
      createdAt: Math.floor(Date.now() / 1000),
    }),
  );
}

const BLOB_TTL = 60 * 60 * 24; // 12 hours

function isBlobExpired(blobValue: BlobValue) {
  return Math.floor(Date.now() / 1000) - blobValue.createdAt > BLOB_TTL;
}

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse,
) {
  response.setHeader("Cache-Control", "max-age=0, s-maxage=300"); // Cache for 5 minutes, reset on re-deployment.

  const url = _request.query.url;
  const queryName = _request.query.queryName;
  const oracleType = _request.query.oracleType;

  if (
    !url ||
    typeof url !== "string" ||
    !queryName ||
    typeof queryName !== "string" ||
    !oracleType ||
    typeof oracleType !== "string" ||
    !oracleTypes.includes(oracleType as OracleType)
  ) {
    response.status(400).send({
      message: "Missing required parameters",
    });
    return;
  }

  const safeUrl = url.replaceAll("/", "-"); // never allow slashes in names

  const blobName = `${process.env.BLOB_KEY_PREFIX}-${safeUrl}-${queryName}-${oracleType}`;

  const blobValue = await kv.get<BlobValue>(blobName);

  if (blobValue === null || isBlobExpired(blobValue)) {
    // This forces the vercel function to update the blob in the background.
    waitUntil(updateBlob(blobName, url, queryName, oracleType as OracleType));
  }

  response.status(200).send({
    url: blobValue?.url ?? null,
  });
}
