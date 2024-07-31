"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiFlowerLotusLight, PiFlowerLotusFill } from "react-icons/pi";
import { PiChartPie, PiChartPieFill } from "react-icons/pi";
import "./navbar.css";

const navItems = [
  {
    path: "/",
    label: "home",
    IconOutline: PiFlowerLotusLight,
    IconFilled: PiFlowerLotusFill,
  },
  {
    path: "/stats",
    label: "stats",
    IconOutline: PiChartPie,
    IconFilled: PiChartPieFill,
  },
];

const NavBar: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [hovered, setHovered] = useState<string>("");
  const pathname = usePathname();

  const isActiveOrHovered = (path: string) =>
    pathname === path || hovered === path;

  return (
    <nav className={`navbar ${isActive ? "fade-out" : "fade-in"}`}>
      <ul>
        {navItems.map(({ path, IconOutline, IconFilled }) => (
          <li
            key={path}
            onMouseEnter={() => setHovered(path)}
            onMouseLeave={() => setHovered("")}
          >
            <Link href={path}>
              {isActiveOrHovered(path) ? <IconFilled /> : <IconOutline />}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
