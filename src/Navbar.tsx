"use client";

import React from "react";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/stats">Pomodoro Stats</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
