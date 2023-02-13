import { Layout, Table } from "@/components";
import { makeMockOracleQueryUIs } from "@/stories/mocks";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";

export default function Propose() {
  const [isLoading, setIsLoading] = useState(true);

  useTimeout(() => {
    setIsLoading(false);
  }, 3000);

  const mockData = makeMockOracleQueryUIs({
    count: 3,
    inputs: [
      { title: "With project specified", project: "Cozy Finance" },
      {
        title: "With expiry type and weird random currency",
        expiryType: "Time-based",
        currency: "RY",
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
      <Table page="propose" rows={mockData} isLoading={isLoading} />
    </Layout>
  );
}
