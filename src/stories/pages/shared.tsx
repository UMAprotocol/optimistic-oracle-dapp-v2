import { Layout, Notifications } from "@/components";
import {
  ErrorProvider,
  FilterAndSearchProvider,
  NotificationsContext,
  NotificationsProvider,
  OracleDataProvider,
  PageProvider,
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
    <PageProvider>
      <NotificationsProvider>
        <OracleDataProvider>
          <ErrorProvider>
            <FilterAndSearchProvider>
              <PanelProvider>
                <Layout>
                  <Component />
                </Layout>
              </PanelProvider>
            </FilterAndSearchProvider>
          </ErrorProvider>
        </OracleDataProvider>
      </NotificationsProvider>
    </PageProvider>
  );
}

export const Template: PageStory = {
  render: (args) => <Wrapper {...args} />,
};

export const NotificationsDecorator: Decorator<PageStoryProps> = (
  Story,
  { args },
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
      <Notifications />
    </NotificationsContext.Provider>
  );
};
