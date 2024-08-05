"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const MainNavLinks = ({ role }: { role?: string }) => {
  const links = [
    { label: "Dashboard", href: "/", adminOnly: false },
    { label: "Tickets", href: "/tickets", adminOnly: false },
    { label: "Users", href: "/users", adminOnly: true },
  ];

  const currentPath = usePathname();

  const handleClick =
    (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      window.location.href = href;
    };

  return (
    <div className="flex items-center gap-2">
      {links
        .filter((link) => !link.adminOnly || role === "ADMIN")
        .map((link) => (
          <a
            href={link.href}
            onClick={handleClick(link.href)}
            className={`navbar-link ${
              currentPath === link.href &&
              "cursor-default text-primary/90 hover:text-primary/60"
            }`}
            key={link.label}
          >
            {link.label}
          </a>
        ))}
    </div>
  );
};

export default MainNavLinks;
