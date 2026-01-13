"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SurahList from "../components/SurahList";
import SurahContent from "../components/SurahContent";
import SettingsModal from "../components/SettingsModal";
import BookmarksModal from "../components/BookmarksModal";
import LoadingBar from "../components/LoadingBar";
import Toast from "../components/Toast";
import { useToast } from "../hooks/useToast";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { motion } from "framer-motion";

export default function Home() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for settings
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
        if (!isSettingsOpen) showToast("Settings opened", "info", 2000);
      }
      
      // Cmd/Ctrl + B for bookmarks
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsBookmarksOpen(prev => !prev);
        if (!isBookmarksOpen) showToast("Bookmarks opened", "info", 2000);
      }

      // Cmd/Ctrl + \ to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }

      // Arrow keys for navigation
      if (selectedSurah !== null && !isSettingsOpen && !isBookmarksOpen) {
        if (e.key === 'ArrowLeft' && selectedSurah > 1) {
          e.preventDefault();
          setSelectedSurah(selectedSurah - 1);
        } else if (e.key === 'ArrowRight' && selectedSurah < 114) {
          e.preventDefault();
          setSelectedSurah(selectedSurah + 1);
        }
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (isBookmarksOpen) setIsBookmarksOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedSurah, isSettingsOpen, isBookmarksOpen]);

  // Show loading bar when changing surahs
  useEffect(() => {
    if (selectedSurah !== null) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedSurah]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Loading Bar */}
      {isLoading && <LoadingBar />}
      
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onBookmarksClick={() => setIsBookmarksOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 overflow-hidden"
      >
        <PanelGroup direction="horizontal">
          {/* Resizable Surah List Panel */}
          <Panel defaultSize={35} minSize={25} maxSize={50}>
            <div className="h-full overflow-hidden">
              <SurahList onSelect={setSelectedSurah} isSidebarOpen={isSidebarOpen} />
            </div>
          </Panel>

          {/* Resize Handle with better styling */}
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-all hover:w-1.5" />

          {/* Surah Content Panel */}
          <Panel>
            <div className="h-full w-full overflow-hidden">
              <SurahContent selectedSurah={selectedSurah} />
            </div>
          </Panel>
        </PanelGroup>
      </motion.main>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        onSurahSelect={setSelectedSurah}
      />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      {/* Keyboard Shortcuts Hint (appears on hover at bottom right) */}
      <div className="fixed bottom-20 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300 z-40">
        <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-3 shadow-lg text-xs">
          <p className="font-semibold mb-2 text-primary">Keyboard Shortcuts</p>
          <div className="space-y-1 text-muted-foreground">
            <p><kbd className="px-2 py-1 bg-muted rounded text-xs">⌘/Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd> Settings</p>
            <p><kbd className="px-2 py-1 bg-muted rounded text-xs">⌘/Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">B</kbd> Bookmarks</p>
            <p><kbd className="px-2 py-1 bg-muted rounded text-xs">⌘/Ctrl</kbd> + <kbd className="px-2 py-1 bg-muted rounded text-xs">\</kbd> Toggle Sidebar</p>
            <p><kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd> <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd> Navigate Surahs</p>
          </div>
        </div>
      </div>
    </div>
  );
}