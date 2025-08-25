import { cn } from "@/helpers";
import { ExternalLinkIcon } from "lucide-react";
import type { LinkProps as NextLinkProps } from "next/link";
import NextLink from "next/link";
import Url from "url";

export type LinkProps = NextLinkProps & {
  children: React.ReactNode;
  externalIcon?: boolean;
  className?: string;
};

export function Link({
  className,
  children,
  externalIcon = false,
  ...props
}: LinkProps) {
  // Url.format is necessary to parse either string or object
  const isInternal = Url.format(props.href).toString().startsWith("/");
  return (
    <NextLink
      className={cn(
        "group group-hover:underline inline items-center gap-2 ",
        className,
      )}
      target={!isInternal ? "_blank" : "_self"}
      {...props}
    >
      {children}
      {!isInternal && externalIcon && (
        <ExternalLinkIcon className="ml-1 inline w-[1em] h-[1em]" />
      )}
    </NextLink>
  );
}
