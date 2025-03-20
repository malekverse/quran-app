"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import SurahList from "../components/SurahList";
import SurahContent from "../components/SurahContent";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Home() {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Resizable SurahList */}
          <Panel defaultSize={30} minSize={20} maxSize={50}>
            <div className="h-full overflow-y-auto">
              <SurahList onSelect={setSelectedSurah} isSidebarOpen={isSidebarOpen} />
            </div>
          </Panel>

          {/* Resize Handle */}
          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300 transition-colors" />

          {/* SurahContent */}
          <Panel>
            <div className="h-full w-full overflow-y-auto">
              <SurahContent selectedSurah={selectedSurah} />
            </div>
          </Panel>
        </PanelGroup>
      </main>
    </div>
  );
}