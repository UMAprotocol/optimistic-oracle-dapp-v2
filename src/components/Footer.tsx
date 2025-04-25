import { socialIcons } from "@/constants";
import Link from "next/link";
import React from "react";

const socialLinks: Array<{
  icon: keyof typeof socialIcons;
  href: string;
  ariaLabel: string;
}> = [
  {
    href: "http://discord.uma.xyz",
    icon: "Discord",
    ariaLabel: "link to uma's discord server",
  },
  {
    href: "https://medium.com/uma-project",
    icon: "Medium",
    ariaLabel: "link to uma's Medium feed",
  },
  {
    href: "https://twitter.com/UMAprotocol",
    icon: "Twitter",
    ariaLabel: "link to uma's X feed",
  },
  {
    href: "http://discourse.uma.xyz",
    icon: "Discourse",
    ariaLabel: "link to uma's Discourse feed",
  },
  {
    href: "https://github.com/UMAprotocol",
    icon: "Github",
    ariaLabel: "link to uma's Github organization",
  },
];

export function Footer() {
  return (
    <footer className="max-h-[400px] w-full py-6 mt-auto bg-white">
      <div className="flex flex-col md:flex-row gap-4 mx-auto items-center justify-start w-full max-w-[--page-width]">
        <div className="flex items-center justify-center md:justify-end gap-6">
          {socialLinks.map(({ href, icon, ariaLabel }) => {
            const Icon = socialIcons[icon];
            return (
              <Link
                className="group"
                key={ariaLabel}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
              >
                <Icon className="h-6 w-6 text-grey-800 transition group-hover:text-red-600" />
              </Link>
            );
          })}
        </div>
        <Link
          className="text-text opacity-50 transition-opacity hover:opacity-100"
          href="https://uma.xyz/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="link to uma's terms of service page"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
