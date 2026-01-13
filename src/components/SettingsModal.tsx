"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XIcon, MoonIcon, SunIcon, VolumeUpIcon, BookOpenIcon } from "@heroicons/react/outline";
import { useTheme } from "@/contexts/ThemeContext";
import { useReadingSettings } from "@/contexts/ReadingSettingsContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { fontSize, setFontSize, translationEnabled, toggleTranslation } = useReadingSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal Container - Centered with Flexbox */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden pointer-events-auto my-8"
            >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close settings"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm opacity-90 mt-1">Customize your reading experience</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
              {/* Theme Setting */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {isDarkMode ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                  Theme
                </h3>
                <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-border">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      {isDarkMode ? "Currently enabled" : "Currently disabled"}
                    </p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`w-14 h-7 rounded-full p-1 transition-colors ${
                      isDarkMode ? "bg-primary" : "bg-muted"
                    }`}
                    aria-label="Toggle dark mode"
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: isDarkMode ? 28 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              {/* Font Size Setting */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpenIcon className="w-5 h-5" />
                  Reading
                </h3>
                
                <div className="p-4 bg-accent/10 rounded-xl border border-border space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium">Arabic Font Size</p>
                      <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-lg font-bold">
                        {fontSize}px
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFontSize(fontSize - 2)}
                        className="px-4 py-2 bg-background hover:bg-accent/20 rounded-lg font-bold transition-colors border border-border"
                        aria-label="Decrease font size"
                      >
                        -
                      </button>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          initial={false}
                          animate={{ width: `${((fontSize - 16) / (40 - 16)) * 100}%` }}
                        />
                      </div>
                      <button
                        onClick={() => setFontSize(fontSize + 2)}
                        className="px-4 py-2 bg-background hover:bg-accent/20 rounded-lg font-bold transition-colors border border-border"
                        aria-label="Increase font size"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Range: 16px - 40px</p>
                  </div>

                  {/* Preview */}
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <p
                      className="font-arabic text-center"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </p>
                  </div>
                </div>
              </div>

              {/* Translation Setting */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <VolumeUpIcon className="w-5 h-5" />
                  Display
                </h3>
                <div className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-border">
                  <div>
                    <p className="font-medium">Show Translations</p>
                    <p className="text-sm text-muted-foreground">
                      Display English translations below verses
                    </p>
                  </div>
                  <button
                    onClick={toggleTranslation}
                    className={`w-14 h-7 rounded-full p-1 transition-colors ${
                      translationEnabled ? "bg-primary" : "bg-muted"
                    }`}
                    aria-label="Toggle translations"
                  >
                    <motion.div
                      className="w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: translationEnabled ? 28 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">About</h3>
                <div className="p-4 bg-accent/10 rounded-xl border border-border space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-2xl shadow-md">
                      📖
                    </div>
                    <div>
                      <p className="font-bold">Quran App</p>
                      <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground pt-2 border-t border-border">
                    A beautiful Quran reading application with audio recitations, translations, and bookmarking features.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Made with ❤️ for the Muslim Ummah
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-muted/30 border-t border-border">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
