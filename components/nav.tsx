"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "./authModal";
const Nav_Items = ["Home", "About", "Services", "Contact"];
function Nav() {
  const pathName = usePathname();
  const [authOpen,SetAuthOpen] = useState(false)
  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-3 left-1/2 -translate-x-1/2 w-[94%] md:w-[86%] z-50 rounded-full bg-black text-white shadow-[0_15px_50px_rgba(0,0,0,0.7)] py-3"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Image src="/logo.png" alt="Logo" width={44} height={44} priority />
        <div className="hidden md:flex items-center gap-10">
          {Nav_Items.map((item, index) => {
            let href;
            if (item == "Home") {
              href = "/";
            } else {
              href = `/${item.toLowerCase()}`;
            }
            const active = href === pathName;
            return (
              <Link
                href={href}
                key={index}
                className={`text-sm font-medium transition ${active ? "text-white" : "text-gray-400 hover:text-white"}`}
              >
                {item}
              </Link>
            );
          })}
        </div>
        <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm" onClick={()=>SetAuthOpen(true)}>
          Login
        </button>
      </div>
    </motion.div>
      <AuthModal open={authOpen} onClose={()=>SetAuthOpen(false)} />
      </>
  );
}

export default Nav;
