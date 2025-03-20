"use client";

import { HomeIcon, CogIcon, LogoutIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-64 bg-white h-screen p-6 border-r fixed lg:relative z-40 ${isOpen ? "block" : "hidden lg:block"}`}
        >
          <h1 className="text-xl font-bold flex items-center gap-2">
            📖 Muslim Pro
          </h1>
          <nav className="mt-6">
            <ul className="space-y-2">
              <li className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 cursor-pointer">
                <HomeIcon className="w-5 h-5" /> Surah
              </li>
              <li className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <CogIcon className="w-5 h-5" /> Setting
              </li>
              <li className="flex items-center gap-3 p-3 text-red-500 mt-6 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                <LogoutIcon className="w-5 h-5" /> Log Out
              </li>
            </ul>
          </nav>
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default Sidebar;