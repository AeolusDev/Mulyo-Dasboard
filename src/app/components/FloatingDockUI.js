"use client"
import React from "react";
import { FloatingDock } from "./FloatingDock";
import {
  IconHome,
  IconSettings,
  IconTerminal2,
  IconBrandGithub,
  IconFolderPlus
} from "@tabler/icons-react";
import Image from "next/image";

export function FloatingDockUi() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/home",
    },

    {
      title: "Manager",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/manager",
    },
    {
      title: "Create Series",
      icon: (
        <IconFolderPlus className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/series/createSeries",
    },
    {
      title: "Settings",
      icon: (
        <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/settings",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://github.com/AeolusDev",
    },
  ];
  return (
    (<div className="z-50 opacity-90 fixed bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-4 text-neutral-content shadow-lg rounded-full ">
      <FloatingDock
        items={links} />
    </div>)
  );
}
