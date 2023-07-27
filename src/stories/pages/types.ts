import type { NotificationsById } from "@/contexts";
import type VerifyPage from "@/components/pages/verify";
import type ProposePage from "@/components/pages/propose";
import type SettledPage from "@/components/pages/settled";
import type { ErrorMessage } from "@shared/types";
import type { StoryObj } from "@storybook/react";

export type Page = typeof VerifyPage | typeof ProposePage | typeof SettledPage;

export type PageStoryProps = {
  Component: Page;
  errorMessages: ErrorMessage[];
  notifications: NotificationsById;
};

export type PageStory = StoryObj<PageStoryProps>;
