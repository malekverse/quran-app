'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, RefreshIcon, BookmarkIcon, VolumeUpIcon, VolumeOffIcon, CheckIcon } from "@heroicons/react/solid";
import { BookmarkIcon as BookmarkOutlineIcon, PlusIcon, MinusIcon, TranslateIcon, ClipboardCopyIcon } from "@heroicons/react/outline";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';

interface SurahData {
  surahNameArabic: string;
  surahNameTranslation: string;
  totalAyah: number;
  arabic1: string[];
  english: string[];
  audio: {
    [key: string]: {
      reciter: string;
      url: string;
      originalUrl: string;
      image?: string;
    };
  };
}

const SurahContent = ({ selectedSurah }: { selectedSurah: number | null }) => {
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [arabicSurah, setArabicSurah] = useState<string[] | null>(null);
  const [englishSurah, setEnglishSurah] = useState<string[] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState<string | null>(null);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  
  const {
    fontSize,
    setFontSize,
    translationEnabled,
    toggleTranslation,
    isBookmarked,
    addBookmark,
    removeBookmark,
    setLastRead,
  } = useReadingSettings();

  useEffect(() => {
    if (selectedSurah === null) return;

    // Store the non-null value for TypeScript
    const surahId = selectedSurah;

    async function fetchSurah() {
      try {
        const res = await fetch(`https://quranapi.pages.dev/api/${surahId}.json`);
        if (!res.ok) {
          throw new Error('Failed to fetch surah');
        }
        const data: SurahData = await res.json();
        setSurah(data);
        setArabicSurah(data.arabic1);
        setEnglishSurah(data.english);

        if (data.audio) {
          const firstReciterKey = Object.keys(data.audio)[0];
          setSelectedReciter(firstReciterKey);
        }

        // Mark as last read
        setLastRead(surahId, 1);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSurah();
    setIsPlaying(false);
  }, [selectedSurah, setLastRead]);

  useEffect(() => {
    const audio = document.getElementById('quran-audio') as HTMLAudioElement;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = async () => {
    const audio = document.getElementById('quran-audio') as HTMLAudioElement;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audio = e.target as HTMLAudioElement;
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audio = e.target as HTMLAudioElement;
    setDuration(audio.duration);
  };

  const handleSeek = (value: number[]) => {
    const audio = document.getElementById('quran-audio') as HTMLAudioElement;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleReciterChange = (value: string) => {
    setSelectedReciter(value);
    setIsPlaying(false);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleBookmarkToggle = () => {
    if (selectedSurah === null) return;
    if (isBookmarked(selectedSurah)) {
      removeBookmark(selectedSurah);
    } else {
      addBookmark(selectedSurah);
    }
  };

  const handleCopyVerse = async (verseIndex: number, arabicText: string, englishText?: string) => {
    const surahName = surah?.surahNameTranslation || '';
    const copyText = englishText && translationEnabled
      ? `${arabicText}\n\n${englishText}\n\n— ${surahName} (${selectedSurah}:${verseIndex + 1})`
      : `${arabicText}\n\n— ${surahName} (${selectedSurah}:${verseIndex + 1})`;
    
    try {
      await navigator.clipboard.writeText(copyText);
      setCopiedVerse(verseIndex);
      setTimeout(() => setCopiedVerse(null), 2000);
    } catch (err) {
      console.error('Failed to copy verse:', err);
    }
  };

  if (selectedSurah === null)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center h-full p-6"
      >
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-6xl mx-auto mb-6 shadow-2xl">
            📖
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Welcome to Quran App
          </h2>
          <p className="text-muted-foreground text-lg">
            Select a surah from the list to begin your spiritual journey
          </p>
          <div className="mt-8 p-4 bg-accent/10 rounded-xl border border-accent/30">
            <p className="text-sm text-muted-foreground">
              "Indeed, this Qur'an guides to that which is most suitable" - (17:9)
            </p>
          </div>
        </div>
      </motion.div>
    );

  if (selectedSurah === null || arabicSurah === null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full p-6"
      >
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-2xl animate-pulse border border-primary/30">
          <div className="h-8 bg-primary/20 rounded-lg w-1/3 mb-3"></div>
          <div className="h-4 bg-primary/10 rounded-lg w-1/4"></div>
        </div>

        <div className="mt-6 space-y-4">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="p-6 border border-border rounded-2xl animate-pulse bg-card">
                <div className="h-10 bg-accent/20 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-accent/10 rounded-lg w-1/2"></div>
              </div>
            ))}
        </div>
      </motion.div>
    );
  }

  if (surah && arabicSurah) {
    const { surahNameArabic, surahNameTranslation, totalAyah, audio } = surah;
    const audioSrc = selectedReciter ? audio[selectedReciter].url : '';
    const selectedReciterData = selectedReciter ? audio[selectedReciter] : null;
    const bookmarked = isBookmarked(selectedSurah);

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full flex flex-col relative"
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-primary via-accent to-primary p-8 text-white shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <motion.h2
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold mb-2 font-arabic"
                >
                  {surahNameArabic}
                </motion.h2>
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl opacity-90"
                >
                  {surahNameTranslation}
                </motion.p>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 mt-3"
                >
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
                    {totalAyah} Ayat
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-medium">
                    Surah {selectedSurah}
                  </span>
                </motion.div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmarkToggle}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
                  aria-label="Bookmark surah"
                >
                  {bookmarked ? (
                    <BookmarkIcon className="w-6 h-6" />
                  ) : (
                    <BookmarkOutlineIcon className="w-6 h-6" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTranslation}
                  className={`p-3 rounded-xl transition-all ${
                    translationEnabled
                      ? 'bg-white text-primary'
                      : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                  }`}
                  aria-label="Toggle translation"
                >
                  <TranslateIcon className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Reading Controls */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-3"
            >
              <span className="text-sm font-medium">Font Size:</span>
              <button
                onClick={() => setFontSize(fontSize - 2)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                aria-label="Decrease font size"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold min-w-[3rem] text-center">{fontSize}px</span>
              <button
                onClick={() => setFontSize(fontSize + 2)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                aria-label="Increase font size"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Verses Container */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 pb-48">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Bismillah */}
            {selectedSurah !== 1 && selectedSurah !== 9 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <p className="text-4xl font-arabic text-primary">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </motion.div>
            )}

            {/* Verses */}
            {arabicSurah.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Surah content not available</p>
              </div>
            ) : (
              arabicSurah.map((verse, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.03 }}
                  className="group relative"
                >
                  <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all">
                    {/* Ayah Number Badge */}
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopyVerse(index, verse, englishSurah?.[index])}
                      className="absolute -top-3 -left-3 w-9 h-9 bg-background border-2 border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:border-primary hover:bg-primary hover:text-white transition-all shadow-md"
                      aria-label="Copy verse"
                    >
                      {copiedVerse === index ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <ClipboardCopyIcon className="w-4 h-4" />
                      )}
                    </button>

                    {/* Arabic Text */}
                    <p
                      className="text-right font-arabic mb-4 leading-loose"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {verse}
                    </p>

                    {/* Translation */}
                    <AnimatePresence>
                      {translationEnabled && englishSurah && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-border pt-4"
                        >
                          <p className="text-muted-foreground leading-relaxed">
                            {englishSurah[index]}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Audio Player - Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl shadow-2xl border-t border-border">
          <div className="max-w-7xl mx-auto p-4">
            <audio
              id="quran-audio"
              src={audioSrc}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onWaiting={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center gap-4">
              {/* Reciter Info */}
              {selectedReciterData && (
                <div className="hidden md:flex items-center gap-3 min-w-[200px]">
                  {selectedReciterData.image && (
                    <img
                      src={selectedReciterData.image}
                      alt={selectedReciterData.reciter}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{selectedReciterData.reciter}</p>
                    <p className="text-xs text-muted-foreground">Reciter</p>
                  </div>
                </div>
              )}

              {/* Play/Pause Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                disabled={isLoading}
                className="p-4 bg-gradient-to-br from-primary to-accent text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <RefreshIcon className="h-6 w-6 animate-spin" />
                ) : isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </motion.button>

              {/* Progress Bar and Controls */}
              <div className="flex-1 space-y-2">
                {/* Seek Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground min-w-[45px]">
                    {formatTime(currentTime)}
                  </span>
                  <Slider
                    value={[currentTime]}
                    max={duration}
                    step={1}
                    onValueChange={handleSeek}
                    className={cn('flex-1')}
                  />
                  <span className="text-xs text-muted-foreground min-w-[45px] text-right">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Reciter Selector */}
                <div className="flex items-center gap-2">
                  <Select onValueChange={handleReciterChange} value={selectedReciter || ''}>
                    <SelectTrigger className="flex-1 h-8 text-xs">
                      <SelectValue placeholder="Select reciter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Available Reciters</SelectLabel>
                        {Object.entries(audio).map(([key, reciterData]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {reciterData.image && (
                                <img
                                  src={reciterData.image}
                                  alt={reciterData.reciter}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                              )}
                              <span>{reciterData.reciter}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Volume Control */}
              <div className="hidden lg:flex items-center gap-2 min-w-[120px]">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                  aria-label="Toggle mute"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeOffIcon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <VolumeUpIcon className="w-5 h-5 text-primary" />
                  )}
                </button>
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className={cn('w-20')}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

// Helper function to format time (e.g., 125 -> 02:05)
const formatTime = (time: number) => {
  if (!isFinite(time)) return '00:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export default SurahContent;
