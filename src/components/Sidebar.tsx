"use client";

import { HomeIcon, BookmarkIcon, CogIcon, MenuIcon, XIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useReadingSettings } from "@/contexts/ReadingSettingsContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onBookmarksClick?: () => void;
  onSettingsClick?: () => void;
}

const Sidebar = ({ isOpen, onToggle, onBookmarksClick, onSettingsClick }: SidebarProps) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { bookmarks } = useReadingSettings();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-lg lg:hidden border border-border hover:bg-accent/50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-72 bg-card/50 backdrop-blur-sm h-screen p-6 border-r border-border fixed lg:relative z-40 ${
            isOpen ? "block" : "hidden lg:block"
          } flex flex-col`}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-2xl shadow-md">
                📖
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Quran App
                </h1>
                <p className="text-xs text-muted-foreground">Read, Listen & Reflect</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              <li className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer shadow-sm">
                <HomeIcon className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">Surahs</span>
              </li>
              <li
                onClick={onBookmarksClick}
                className="flex items-center justify-between gap-3 p-3 hover:bg-accent/10 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <BookmarkIcon className="w-5 h-5 group-hover:text-primary transition-colors" />
                  <span className="font-medium">Bookmarks</span>
                </div>
                {bookmarks.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                    {bookmarks.length}
                  </span>
                )}
              </li>
              <li
                onClick={onSettingsClick}
                className="flex items-center gap-3 p-3 hover:bg-accent/10 rounded-xl transition-all cursor-pointer group"
              >
                <CogIcon className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span className="font-medium">Settings</span>
              </li>
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="mt-auto space-y-4 pt-6 border-t border-border">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-accent/10 hover:bg-accent/20 transition-all cursor-pointer group"
              aria-label="Toggle dark mode"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <MoonIcon className="w-5 h-5 text-accent" />
                ) : (
                  <SunIcon className="w-5 h-5 text-accent" />
                )}
                <span className="font-medium">
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-primary' : 'bg-muted'}`}>
                <motion.div
                  className="w-4 h-4 bg-white rounded-full shadow-md"
                  animate={{ x: isDarkMode ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
            </button>

            {/* App Info */}
            <div className="text-center text-xs text-muted-foreground">
              <p>Made with ❤️ for the Ummah</p>
              <p className="mt-1">v1.0.0</p>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default Sidebar;