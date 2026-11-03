import { config } from "@/constants";
import { ErrorBanner } from "./ErrorBanner";
import { ManagedOracleBanner } from "./ManagedOracleBanner";
import { SunsetBanner } from "./SunsetBanner";

export function Banners() {
  return (
    <>
      <ErrorBanner />
      <SunsetBanner />
      {config.showManagedOracleBanner && <ManagedOracleBanner />}
    </>
  );
}
