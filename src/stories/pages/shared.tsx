import { Layout } from "@/components";
import {
  ErrorProvider,
  NotificationsContext,
  NotificationsProvider,
  OracleDataProvider,
  PanelProvider,
} from "@/contexts";
import type { UniqueId } from "@/types";
import type { Decorator } from "@storybook/react";
import { useState } from "react";
import type { Page, PageStory, PageStoryProps } from "./types";

interface Props {
  Component: Page;
}
export function Wrapper({ Component }: Props) {
  return (
    <NotificationsProvider>
      <OracleDataProvider>
        <ErrorProvider>
          <PanelProvider>
            <Layout>
              <Component />
            </Layout>
          </PanelProvider>
        </ErrorProvider>
      </OracleDataProvider>
    </NotificationsProvider>
  );
}

export const Template: PageStory = {
  render: (args) => <Wrapper {...args} />,
};

export const NotificationsDecorator: Decorator<PageStoryProps> = (
  Story,
  { args }
) => {
  const [notifications, setNotifications] = useState(args.notifications);
  function clearNotifications() {
    setNotifications({});
  }

  function removeNotification(id: UniqueId) {
    setNotifications((prev) => ({ ...prev, [id]: undefined }));
  }
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        removeNotification,
        clearNotifications,
      }}
    >
      <Story {...args} />
    </NotificationsContext.Provider>
  );
};
