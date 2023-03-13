import type VerifyPage from "@/pages";
import type ProposePage from "@/pages/propose";
import type SettledPage from "@/pages/settled";
import type { ErrorMessage } from "@/types";
import type { StoryObj } from "@storybook/react";

export type Page = typeof VerifyPage | typeof ProposePage | typeof SettledPage;

export type PageStory = StoryObj<{
  Component: Page;
  errorMessages: ErrorMessage[];
}>;