import { Layout, Table } from "@/components";
import { makeMockOracleQueryUIs } from "@/stories/mocks";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";

export default function Settled() {
  const [isLoading, setIsLoading] = useState(true);

  useTimeout(() => {
    setIsLoading(false);
  }, 3000);

  const mockData = makeMockOracleQueryUIs({
    count: 3,
    inputForAll: { action: undefined, actionType: undefined },
    inputs: [
      {
        title: "With project specified and price",
        project: "Cozy Finance",
        assertion: undefined,
        price: 123,
      },
      {
        title: "With expiry type and weird random currency and liveness ends",
        expiryType: "Time-based",
        currency: "RY",
        livenessEndsMilliseconds: Date.now() + 10_000,
      },
      {
        title: "With chain name, oracle type and other known currency",
        currency: "ETH",
        chainName: "Polygon",
        oracleType: "Skinny Optimistic Oracle",
      },
    ],
  });

  return (
    <Layout>
      <Table page="settled" rows={mockData} isLoading={isLoading} />
    </Layout>
  );
}
