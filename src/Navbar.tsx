"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsBarChart, BsBarChartFill } from "react-icons/bs";
import "./navbar.css";

const navItems = [
  {
    path: "/",
    label: "home",
    IconOutline: AiOutlineHome,
    IconFilled: AiFillHome,
  },
  {
    path: "/stats",
    label: "stats",
    IconOutline: BsBarChart,
    IconFilled: BsBarChartFill,
  },
];

const NavBar: React.FC = () => {
  const [hovered, setHovered] = useState<string>("");
  const pathname = usePathname();

  const isActiveOrHovered = (path: string) =>
    pathname === path || hovered === path;

  return (
    <nav className="navbar">
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
