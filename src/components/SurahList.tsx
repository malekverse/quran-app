"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SearchIcon, BookmarkIcon } from "@heroicons/react/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/solid";
import surahs from '../db/surah.json';
import Fuse from 'fuse.js';
import { useReadingSettings } from "@/contexts/ReadingSettingsContext";

const SurahList = ({ onSelect, isSidebarOpen }: { onSelect: (id: number) => void; isSidebarOpen: boolean }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { isBookmarked, addBookmark, removeBookmark, lastReadSurah } = useReadingSettings();

  // Configure Fuse.js for fuzzy search
  const fuse = new Fuse(surahs, {
    keys: [
      "surahName",
      "surahNameArabic",
      "surahNameTranslation",
      "revelationPlace",
    ],
    includeScore: true,
    threshold: 0.3,
    ignoreLocation: true,
  });

  // Filter surahs based on search query
  const filteredSurahs = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : surahs;

  const handleBookmarkToggle = (e: React.MouseEvent, surahId: number) => {
    e.stopPropagation();
    if (isBookmarked(surahId)) {
      removeBookmark(surahId);
    } else {
      addBookmark(surahId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full p-4 bg-card/30 backdrop-blur-sm"
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Surahs
        </h2>
        <p className="text-sm text-muted-foreground">Select a surah to begin reading</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, meaning, or place..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Surah List */}
      <ul className="h-[calc(100%-10rem)] overflow-y-auto scrollbar-thin space-y-2">
        {filteredSurahs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No surahs found</p>
          </div>
        ) : (
          filteredSurahs.map((surah, index) => {
            const surahId = surahs.findIndex(s => s.surahName === surah.surahName) + 1;
            const isSelected = selectedId === surahId;
            const isLastRead = lastReadSurah === surahId;
            const bookmarked = isBookmarked(surahId);

            return (
              <motion.li
                key={surahId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => {
                  setSelectedId(surahId);
                  onSelect(surahId);
                }}
                className={`relative p-4 rounded-xl cursor-pointer transition-all group ${
                  isSelected
                    ? "bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary shadow-md"
                    : "bg-card hover:bg-accent/10 border border-border hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                {/* Surah Number Badge */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {surahId}
                </div>

                {/* Content */}
                <div className="ml-14 pr-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{surah.surahName}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {surah.surahNameTranslation}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="bg-accent/20 px-2 py-1 rounded-md">
                          {surah.totalAyah} Ayat
                        </span>
                        <span className="bg-accent/20 px-2 py-1 rounded-md">
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

                {/* Bookmark Button */}
                <button
                  onClick={(e) => handleBookmarkToggle(e, surahId)}
                  className="absolute bottom-4 right-4 p-1.5 rounded-lg hover:bg-accent/20 transition-colors"
                  aria-label="Bookmark surah"
                >
                  {bookmarked ? (
                    <BookmarkSolidIcon className="w-5 h-5 text-primary" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>

                {/* Last Read Indicator */}
                {isLastRead && (
                  <div className="absolute top-2 right-2">
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-medium">
                      Last Read
                    </span>
                  </div>
                )}
              </motion.li>
            );
          })
        )}
      </ul>
    </motion.div>
  );
};

export default SurahList;