"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import surahs from '../db/surah.json';
import Fuse from 'fuse.js';

const SurahList = ({ onSelect, isSidebarOpen }: { onSelect: (id: number) => void; isSidebarOpen: boolean }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Configure Fuse.js for fuzzy search
  const fuse = new Fuse(surahs, {
    keys: [
      "surahName",
      "surahNameArabic",
      "surahNameTranslation",
      "revelationPlace",
    ],
    includeScore: true,
    threshold: 0.3, // Adjust for more/less strict matching
    ignoreLocation: true, // Search across the entire string
  });

  // Filter surahs based on search query
  const filteredSurahs = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : surahs;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search surah..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      {/* Surah List */}
      <ul className="h-[calc(100%-3rem)] overflow-y-auto">
        {filteredSurahs.map((surah, index) => (
          <motion.li
            key={index + 1}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => {
              setSelectedId(index + 1);
              onSelect(index + 1);
            }}
            className={`p-4 rounded-lg cursor-pointer ${
              selectedId === index + 1 ? "bg-blue-100 border-l-4 border-blue-500" : "hover:bg-gray-100"
            }`}
          >
            <h3 className="font-semibold">{surah.surahName}</h3>
            <p className="text-sm text-gray-500">
              {surah.surahNameArabic} - {surah.totalAyah} Ayat
            </p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SurahList;