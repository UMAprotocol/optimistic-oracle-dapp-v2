import NextLink from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export const Text = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs sm:text-base break-words">{children}</p>
);

export const Link = (props: ComponentPropsWithoutRef<typeof NextLink>) => (
  <NextLink
    {...props}
    className={`text-[length:inherit] text-red-500 transition hover:opacity-75 ${props.className}`}
  >
    {props.children}
  </NextLink>
);

export const WordBreakLink = (props: ComponentPropsWithoutRef<typeof Link>) => (
  <Link {...props} className="break-all">
    {props.children}
  </Link>
);

export const SectionTitleWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex gap-3 mb-4">{children}</div>;

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold [&>span]:font-normal">{children}</h2>
);

export const SectionSubTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => <h3 className="font-semibold mt-4">{children}</h3>;

export const ErrorWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-panel-content-width min-h-[48px] flex items-center gap-4 mt-5 px-4 bg-red-500/5 border-2 border-red-500 rounded-sm">
    {children}
  </div>
);
