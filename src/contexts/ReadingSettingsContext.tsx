"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ReadingSettings {
  fontSize: number;
  translationEnabled: boolean;
  bookmarks: number[];
  lastReadSurah: number | null;
  lastReadAyah: number | null;
}

interface ReadingSettingsContextType extends ReadingSettings {
  setFontSize: (size: number) => void;
  toggleTranslation: () => void;
  addBookmark: (surahId: number) => void;
  removeBookmark: (surahId: number) => void;
  isBookmarked: (surahId: number) => boolean;
  setLastRead: (surahId: number, ayahId: number) => void;
}

const ReadingSettingsContext = createContext<ReadingSettingsContextType | undefined>(undefined);

export const ReadingSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSizeState] = useState(24);
  const [translationEnabled, setTranslationEnabled] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [lastReadSurah, setLastReadSurah] = useState<number | null>(null);
  const [lastReadAyah, setLastReadAyah] = useState<number | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("readingSettings");
    if (savedSettings) {
      const settings: ReadingSettings = JSON.parse(savedSettings);
      setFontSizeState(settings.fontSize);
      setTranslationEnabled(settings.translationEnabled);
      setBookmarks(settings.bookmarks);
      setLastReadSurah(settings.lastReadSurah);
      setLastReadAyah(settings.lastReadAyah);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings: ReadingSettings = {
      fontSize,
      translationEnabled,
      bookmarks,
      lastReadSurah,
      lastReadAyah,
    };
    localStorage.setItem("readingSettings", JSON.stringify(settings));
  }, [fontSize, translationEnabled, bookmarks, lastReadSurah, lastReadAyah]);

  const setFontSize = (size: number) => {
    setFontSizeState(Math.max(16, Math.min(40, size)));
  };

  const toggleTranslation = () => {
    setTranslationEnabled((prev) => !prev);
  };

  const addBookmark = (surahId: number) => {
    setBookmarks((prev) => [...new Set([...prev, surahId])]);
  };

  const removeBookmark = (surahId: number) => {
    setBookmarks((prev) => prev.filter((id) => id !== surahId));
  };

  const isBookmarked = (surahId: number) => {
    return bookmarks.includes(surahId);
  };

  const setLastRead = (surahId: number, ayahId: number) => {
    setLastReadSurah(surahId);
    setLastReadAyah(ayahId);
  };

  return (
    <ReadingSettingsContext.Provider
      value={{
        fontSize,
        translationEnabled,
        bookmarks,
        lastReadSurah,
        lastReadAyah,
        setFontSize,
        toggleTranslation,
        addBookmark,
        removeBookmark,
        isBookmarked,
        setLastRead,
      }}
    >
      {children}
    </ReadingSettingsContext.Provider>
  );
};

export const useReadingSettings = () => {
  const context = useContext(ReadingSettingsContext);
  if (!context) {
    throw new Error("useReadingSettings must be used within a ReadingSettingsProvider");
  }
  return context;
};
