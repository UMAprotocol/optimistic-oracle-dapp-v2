import Propose from "@/components/pages/propose";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Optimistic Oracle V2 | Propose",
};

export default function ProposePage() {
  return <Propose />;
}
