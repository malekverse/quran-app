"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XIcon, BookmarkIcon, TrashIcon } from "@heroicons/react/outline";
import { useReadingSettings } from "@/contexts/ReadingSettingsContext";
import surahs from '../db/surah.json';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSurahSelect: (id: number) => void;
}

const BookmarksModal = ({ isOpen, onClose, onSurahSelect }: BookmarksModalProps) => {
  const { bookmarks, removeBookmark } = useReadingSettings();

  const bookmarkedSurahs = bookmarks.map(id => ({
    id,
    ...surahs[id - 1]
  }));

  const handleSurahClick = (id: number) => {
    onSurahSelect(id);
    onClose();
  };

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookmarkIcon className="w-7 h-7" />
                  <div>
                    <h2 className="text-2xl font-bold">Bookmarks</h2>
                    <p className="text-sm opacity-90">
                      {bookmarks.length} {bookmarks.length === 1 ? 'surah' : 'surahs'} saved
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close bookmarks"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
              {bookmarks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookmarkIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Bookmarks Yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Bookmark your favorite surahs by clicking the bookmark icon in the surah list or header.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarkedSurahs.map((surah, index) => (
                    <motion.div
                      key={surah.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-accent/10 hover:bg-accent/20 border border-border rounded-xl p-4 cursor-pointer transition-all"
                      onClick={() => handleSurahClick(surah.id)}
                    >
                      {/* Surah Number Badge */}
                      <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {surah.id}
                      </div>

                      {/* Content */}
                      <div className="ml-14 pr-10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{surah.surahName}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {surah.surahNameTranslation}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="bg-accent/30 px-2 py-1 rounded-md">
                                {surah.totalAyah} Ayat
                              </span>
                              <span className="bg-accent/30 px-2 py-1 rounded-md">
                                {surah.revelationPlace}
                              </span>
                            </div>
                          </div>

                          {/* Arabic Name */}
                          <div className="text-right font-arabic">
                            <p className="text-2xl text-primary">{surah.surahNameArabic}</p>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(surah.id);
                        }}
                        className="absolute bottom-4 right-4 p-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Remove bookmark"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {bookmarks.length > 0 && (
              <div className="p-4 bg-muted/30 border-t border-border">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookmarksModal;
