'use client';

import { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, RefreshIcon } from "@heroicons/react/solid";
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
  const [selectedReciter, setSelectedReciter] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSurah === null) return;

    async function fetchSurah() {
      try {
        const res = await fetch(`https://quranapi.pages.dev/api/${selectedSurah}.json`);
        if (!res.ok) {
          throw new Error('Failed to fetch surah');
        }
        const data: SurahData = await res.json();
        console.log(data)
        setSurah(data);
        setArabicSurah(data.arabic1);
        setEnglishSurah(data.english);

        if (data.audio) {
          const firstReciterKey = Object.keys(data.audio)[0];
          setSelectedReciter(firstReciterKey);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchSurah();
  }, [selectedSurah]);

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
  };

  if (selectedSurah === null)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-2/3 p-6"
      >
        <div className="bg-blue-100 p-4 rounded-md">
          <h2 className="text-xl font-bold">Welcome To Muslim Pro.</h2>
          <p className="text-sm text-gray-600">Select surah to start reading Quran</p>
        </div>
      </motion.div>
    );

  if (selectedSurah === null || arabicSurah === null) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-2/3 p-6"
      >
        <div className="bg-blue-100 p-4 rounded-md animate-pulse">
          <div className="h-6 bg-gray-300 rounded-md w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
        </div>

        <div className="mt-4 space-y-4">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="p-4 border rounded-md animate-pulse">
                <div className="h-8 bg-gray-300 rounded-md w-3/4 mb-2"></div>
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

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full p-6 relative overflow-y-auto"
      >
        {/* Surah Content */}
        <div className="bg-blue-100 p-4 text-right rounded-md">
          <h2 className="text-xl font-bold ">{surahNameArabic}</h2>
          <p className="text-sm text-gray-600">
            {surahNameTranslation} - {totalAyah} Ayat
          </p>
        </div>

        <div className="mt-4 space-y-4">
          {arabicSurah.length === 0 ? (
            <p>Surah doesn't exist</p>
          ) : (
            arabicSurah.map((verse, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 border rounded-md"
              >
                <p className="text-right text-2xl font-arabic mb-2">{verse}</p>
                <p className="text-sm text-gray-500">{englishSurah ? englishSurah[index] : ''}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Audio Player (Fixed at Bottom of Viewport) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t border-gray-200">
          <div className="max-w-2xl mx-auto">
            <audio
              id="quran-audio"
              src={audioSrc}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onWaiting={() => setIsLoading(true)}
              onCanPlay={() => setIsLoading(false)}
            />
            <div className="flex items-center justify-between space-x-4">
              {/* Reciter Image and Name */}
              {selectedReciterData && (
                <div className="flex items-center space-x-3">
                  {selectedReciterData.image && (
                    <img
                      src={selectedReciterData.image}
                      alt={selectedReciterData.reciter}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{selectedReciterData.reciter}</p>
                    <p className="text-xs text-gray-500">Reciter</p>
                  </div>
                </div>
              )}

              {/* Play/Pause Button */}
              <button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <RefreshIcon className="h-6 w-6 animate-spin" /> // Loading spinner
                ) : isPlaying ? (
                  <PauseIcon className="h-6 w-6" /> // Pause icon
                ) : (
                  <PlayIcon className="h-6 w-6" /> // Play icon
                )}
              </button>

              {/* Seek Bar */}
              <div className="flex-1">
                <Slider
                  defaultValue={[0]}
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={handleSeek}
                  className={cn('w-full')}
                />
              </div>

              {/* Time Display */}
              <span className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Reciter Selector */}
            <div className="mt-4">
              <Select onValueChange={handleReciterChange} value={selectedReciter || ''}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reciter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Reciters</SelectLabel>
                    {Object.entries(audio).map(([key, reciterData]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          {reciterData.image && (
                            <img
                              src={reciterData.image}
                              alt={reciterData.reciter}
                              className="w-6 h-6 rounded-full object-cover"
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
        </div>
      </motion.div>
    );
  }

  return null;
};

// Helper function to format time (e.g., 125 -> 02:05)
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default SurahContent;