import { Panel } from "@/components";
import { ErrorProvider, OracleDataProvider, PanelProvider } from "@/contexts";
import type { Page, PageStory } from "./types";

interface Props {
  Component: Page;
}
export function Wrapper({ Component }: Props) {
  return (
    <OracleDataProvider>
      <ErrorProvider>
        <PanelProvider>
          <Component />
          <Panel />
        </PanelProvider>
      </ErrorProvider>
    </OracleDataProvider>
  );
}

export const Template: PageStory = {
  render: (args) => <Wrapper {...args} />,
};
