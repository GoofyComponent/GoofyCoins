import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  return (
    <nav className="absolute top-0 w-full text-white py-4 px-4 flex justify-between h-18 bg">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Link to="/" className="font-bold text-lg">
          GoofyCoins
        </Link>
      </div>
      <div></div>
    </nav>
  );
};

export default Navbar;
