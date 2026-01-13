# 📖 Quran App - Read, Listen & Reflect

A beautiful and modern Quran reading application built with Next.js, featuring audio recitations, translations, bookmarking, and an elegant dark mode.

![Quran App](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎨 Beautiful Design
- **Islamic-themed color palette** with emerald and teal accents
- **Dark mode support** with smooth transitions for comfortable night reading
- **Gradient accents** and modern UI components
- **Responsive design** that works seamlessly on desktop, tablet, and mobile
- **Smooth animations** powered by Framer Motion

### 📚 Reading Experience
- **114 Surahs** with Arabic text and English translations
- **Beautiful Arabic typography** using the Amiri font
- **Adjustable font size** (16px - 40px) for comfortable reading
- **Toggle translations** on/off for focused Arabic reading
- **Bismillah display** at the start of each surah (except Surah 1 & 9)
- **Verse-by-verse layout** with clear numbering

### 🎵 Audio Features
- **Multiple reciters** with reciter profiles and images
- **Full audio player** with play/pause, seek, and volume controls
- **Progress tracking** with visual timeline
- **Reciter selection** with dropdown menu
- **Auto-pause** on reciter change or surah switch

### 🔖 Smart Features
- **Bookmark surahs** for quick access to your favorites
- **Last read tracking** - automatically remembers where you left off
- **Fuzzy search** to find surahs by name, meaning, or revelation place
- **Reading progress** persistence across sessions
- **Settings saved** in browser localStorage

### 🎯 User Interface
- **Collapsible sidebar** with app navigation
- **Resizable panels** to customize your layout
- **Smooth scrolling** with custom scrollbar styling
- **Loading states** with elegant skeleton screens and progress bar
- **Hover effects** and transitions throughout
- **Gradient badges** for surah numbers and metadata
- **Settings modal** for customizing your experience
- **Bookmarks modal** for quick access to saved surahs
- **Toast notifications** for user feedback
- **Error boundary** for graceful error handling

### ⌨️ Keyboard Shortcuts
- **Cmd/Ctrl + K** - Open Settings
- **Cmd/Ctrl + B** - Open Bookmarks
- **Cmd/Ctrl + \\** - Toggle Sidebar
- **Arrow Left/Right** - Navigate between surahs
- **Escape** - Close modals

### 📋 Copy & Share
- **Copy verses** with one click (includes Arabic, translation, and reference)
- **Visual feedback** with checkmark animation
- **Perfect formatting** for sharing on social media

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/quran-app.git
cd quran-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Heroicons](https://heroicons.com/)
- **Search**: [Fuse.js](https://fusejs.io/) for fuzzy search
- **Layout**: [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)
- **Fonts**: Google Fonts (Geist, Amiri)

## 📁 Project Structure

```
quran-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page with main layout
│   │   └── globals.css         # Global styles and theme
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── SurahList.tsx       # List of surahs with search
│   │   ├── SurahContent.tsx    # Main content viewer
│   │   └── ui/                 # Reusable UI components
│   ├── contexts/
│   │   ├── ThemeContext.tsx    # Dark mode management
│   │   └── ReadingSettingsContext.tsx  # User preferences
│   ├── db/
│   │   └── surah.json          # Surah metadata
│   └── lib/
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
└── package.json
```

## 🎨 Color Scheme

### Light Mode
- Primary: Emerald (HSL: 160 84% 39%)
- Accent: Teal (HSL: 160 60% 50%)
- Background: Warm white (HSL: 42 47% 97%)

### Dark Mode
- Primary: Lighter Emerald (HSL: 160 70% 45%)
- Accent: Teal (HSL: 160 60% 40%)
- Background: Dark slate (HSL: 160 20% 8%)

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Key Features Implementation

### Dark Mode
Toggle between light and dark themes with a smooth transition. Theme preference is saved to localStorage.

### Font Size Control
Adjust the Arabic text size from 16px to 40px using the + and - buttons in the header.

### Bookmarking
Click the bookmark icon on any surah to save it. Bookmarks are persisted across sessions.

### Search
Use the fuzzy search to find surahs by:
- Surah name (e.g., "Fatiha", "Baqarah")
- Arabic name
- English translation/meaning
- Revelation place (Meccan/Medinan)

### Audio Player
- Select from multiple reciters
- Control playback with play/pause
- Seek through the recitation
- Adjust volume
- See reciter information and profile images

## 🌐 API

This app uses the [Quran API](https://quranapi.pages.dev/) for fetching surah data, translations, and audio recitations.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Quran text and translations from [Quran API](https://quranapi.pages.dev/)
- Icons from [Heroicons](https://heroicons.com/)
- Arabic font from [Google Fonts - Amiri](https://fonts.google.com/specimen/Amiri)
- UI components from [Radix UI](https://www.radix-ui.com/)

## 💝 Made with Love

This app is made with ❤️ for the Muslim Ummah. May it help in your Quranic journey.

---

**"Indeed, this Qur'an guides to that which is most suitable"** - Quran 17:9
