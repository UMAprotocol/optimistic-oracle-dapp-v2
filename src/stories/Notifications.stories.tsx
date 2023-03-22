import { Notifications } from "@/components";
import type { NotificationsById } from "@/contexts";
import {
  defaultNotificationsContextState,
  NotificationsContext,
} from "@/contexts";
import type { Meta, StoryObj } from "@storybook/react";
import { defaultMockNotifications, makeMockNotifications } from "./mocks";

interface Props {
  notifications: NotificationsById;
}

const meta: Meta = {
  component: Notifications,
};

export default meta;

type Story = StoryObj<Props>;

const Template: Story = {
  render: ({ notifications }) => {
    const mockNotificationsContextState = {
      ...defaultNotificationsContextState,
      notifications,
    };
    return (
      <NotificationsContext.Provider value={mockNotificationsContextState}>
        <Notifications />
      </NotificationsContext.Provider>
    );
  },
};

export const OneNotification = {
  ...Template,
  args: {
    notifications: makeMockNotifications([{}]),
  },
};

export const MultipleNotifications = {
  ...Template,
  args: {
    notifications: defaultMockNotifications,
  },
};
