import { config } from "@/constants";
import { ErrorBanner } from "./ErrorBanner";
import { ManagedOracleBanner } from "./ManagedOracleBanner";

export function Banners() {
  return (
    <>
      <ErrorBanner />
      {config.showManagedOracleBanner && <ManagedOracleBanner />}
    </>
  );
}
