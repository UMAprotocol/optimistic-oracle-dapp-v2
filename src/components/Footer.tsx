import { socialIcons } from "@/constants";
import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="max-h-[400px] w-full py-6 mt-auto bg-white">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 mx-auto px-4 items-center justify-start w-full max-w-[--page-width]">
        <div className="flex items-center justify-center md:justify-end gap-4">
          <Link
            className="group"
            href="http://discord.uma.xyz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="link to uma's discord server"
          >
            <socialIcons.Discord className="h-6 w-6 text-grey-800 transition group-hover:text-red-600" />
          </Link>
          <Link
            className="group"
            href="https://twitter.com/UMAprotocol"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="link to uma's twitter page"
          >
            <socialIcons.Twitter className="h-6 w-6 text-grey-800 transition group-hover:text-red-600" />
          </Link>
          <Link
            className="hover:text-red-600 transition"
            href="https://docs.uma.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="link to uma's documentation"
          >
            Docs
          </Link>
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
