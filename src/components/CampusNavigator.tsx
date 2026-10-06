import React, { useState, useMemo, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
import {
  Search,
  Compass,
  MapPin,
  Building,
  Layers,
  ArrowRight,
  Clock,
  User,
  CheckCircle2,
  Navigation,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
  BookOpen,
  Cpu,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import {
  ACROPOLIS_CAMPUS_ROOMS,
  CampusRoom
} from '../data/campusRoomsData';
import {
  CAMPUS_BLOCKS,
  ACROPOLIS_CENTER
} from '../data/campusFoodData';

function MapCameraPan({ target, zoom }: { target: { lat: number; lng: number } | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !target) return;
    map.panTo(target);
    if (zoom) map.setZoom(zoom);
  }, [map, target, zoom]);
  return null;
}

interface CampusNavigatorProps {
  theme: 'dark' | 'light';
  initialRoomCode?: string;
  onBackToDashboard?: () => void;
}

export default function CampusNavigator({ 
  theme, 
  initialRoomCode = 'Lab 116',
  onBackToDashboard
}: CampusNavigatorProps) {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState(initialRoomCode);
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<'all' | 'block-a' | 'block-b' | 'block-c'>('all');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<'all' | '0' | '1' | '2'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Selected Room for detailed inspection
  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    const found = ACROPOLIS_CAMPUS_ROOMS.find((r) => r.code.toLowerCase().includes('116'));
    return found ? found.id : ACROPOLIS_CAMPUS_ROOMS[0].id;
  });

  // Navigation Origin Point
  const [navigationOrigin, setNavigationOrigin] = useState<string>('gate-1');

  // View tabs: "navigator" (Floor Plan + Steps) | "map" (Google Map Campus View)
  const [viewTab, setViewTab] = useState<'navigator' | 'floorplan' | 'map'>('navigator');

  // Interactive Floor Plan block & level
  const [activeFloorBlock, setActiveFloorBlock] = useState<'block-b' | 'block-a' | 'block-c'>('block-b');
  const [activeFloorLevel, setActiveFloorLevel] = useState<0 | 1 | 2>(1);

  // Map state
  const [mapTarget, setMapTarget] = useState<{ lat: number; lng: number } | null>(ACROPOLIS_CENTER);
  const [mapZoom, setMapZoom] = useState(17);
  const [showInfoWindow, setShowInfoWindow] = useState(true);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return ACROPOLIS_CAMPUS_ROOMS.filter((room) => {
      if (selectedBlockFilter !== 'all' && room.blockId !== selectedBlockFilter) return false;
      if (selectedFloorFilter !== 'all' && room.floor !== Number(selectedFloorFilter)) return false;
      if (selectedCategoryFilter !== 'all' && room.category !== selectedCategoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = room.name.toLowerCase().includes(q);
        const matchCode = room.code.toLowerCase().includes(q);
        const matchDesc = room.description.toLowerCase().includes(q);
        const matchBlock = room.blockName.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDesc && !matchBlock) return false;
      }
      return true;
    });
  }, [selectedBlockFilter, selectedFloorFilter, selectedCategoryFilter, searchQuery]);

  const activeRoom = useMemo(() => {
    return ACROPOLIS_CAMPUS_ROOMS.find((r) => r.id === selectedRoomId) || ACROPOLIS_CAMPUS_ROOMS[0];
  }, [selectedRoomId]);

  const handleSelectRoom = (room: CampusRoom) => {
    setSelectedRoomId(room.id);
    setActiveFloorBlock(room.blockId);
    setActiveFloorLevel(room.floor);
    setMapTarget({ lat: room.lat, lng: room.lng });
    setMapZoom(18);
    setShowInfoWindow(true);
  };

  // Rooms belonging to the current active floor schematic
  const schematicRooms = useMemo(() => {
    return ACROPOLIS_CAMPUS_ROOMS.filter(
      (r) => r.blockId === activeFloorBlock && r.floor === activeFloorLevel
    );
  }, [activeFloorBlock, activeFloorLevel]);

  // Pre-configured origin locations for navigation steps
  const origins = [
    { id: 'gate-1', label: 'Gate 1 (Main Bypass Entrance)' },
    { id: 'gate-2', label: 'Gate 2 (Sports Ground)' },
    { id: 'block-a-lobby', label: 'Block A Main Reception' },
    { id: 'block-b-porch', label: 'Block B Nescafe Porch' },
    { id: 'block-c-library', label: 'Block C Library Entrance' }
  ];

  return (
    <div className={`w-full rounded-3xl overflow-hidden border transition-all ${
      theme === 'dark' 
        ? 'bg-[#0E0E10] border-zinc-800 text-stone-100 shadow-xl' 
        : 'bg-[#FDFBF7] border-stone-200 text-[#2D2A26] shadow-sm'
    }`}>
      
      {/* HEADER SECTION */}
      <div className={`p-5 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        theme === 'dark' ? 'border-zinc-800/80 bg-zinc-950/70' : 'border-stone-200/80 bg-white/80'
      }`}>
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              type="button"
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                theme === 'dark'
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
                  : 'border-stone-200 bg-white text-stone-700 hover:text-black hover:bg-stone-100'
              }`}
              title="Return to Dashboard Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          )}

          <div className="w-11 h-11 rounded-2xl bg-[#7A1F1E] text-white flex items-center justify-center shadow-md shrink-0">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg md:text-xl font-bold tracking-tight">
                Acropolis Campus Navigator &amp; Room Finder
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#7A1F1E]/10 text-[#7A1F1E] dark:bg-rose-950/40 dark:text-rose-300 text-[10px] font-mono font-bold tracking-wider uppercase border border-[#7A1F1E]/20">
                AITR 3-Block Matrix
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
              Find Lab 116, CV Raman Lab, lecture halls, and department offices across 3 blocks &amp; 3 floors.
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center p-1 rounded-2xl bg-stone-200/60 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 self-start md:self-auto text-xs">
          <button
            onClick={() => setViewTab('navigator')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewTab === 'navigator'
                ? 'bg-[#7A1F1E] text-white shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Turn-by-Turn Guide</span>
          </button>

          <button
            onClick={() => setViewTab('floorplan')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewTab === 'floorplan'
                ? 'bg-[#7A1F1E] text-white shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Floor Schematic</span>
          </button>

          <button
            onClick={() => setViewTab('map')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewTab === 'map'
                ? 'bg-[#7A1F1E] text-white shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Campus Google Map</span>
          </button>
        </div>
      </div>

      {/* QUICK PRESET CHIPS */}
      <div className={`px-5 py-2.5 border-b flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none ${
        theme === 'dark' ? 'border-zinc-800/60 bg-zinc-900/30' : 'border-stone-200/60 bg-stone-50/50'
      }`}>
        <span className="text-stone-400 font-bold uppercase tracking-wider text-[9px] shrink-0">Popular:</span>
        {[
          { label: 'Lab 116 (Second Block)', query: '116' },
          { label: 'CV Raman Physics Lab', query: 'CV Raman' },
          { label: 'Alan Turing AI Lab (Block A)', query: 'Turing' },
          { label: 'Central Library (Block C)', query: 'Library' },
          { label: 'CAD/CAM Robotics Lab', query: 'CAD' },
          { label: 'Placement Cell CRD', query: 'Placement' },
          { label: 'Auditorium (Block B)', query: 'Auditorium' },
          { label: 'Exam Cell', query: 'Exam' }
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setSearchQuery(item.query);
              const match = ACROPOLIS_CAMPUS_ROOMS.find((r) => 
                r.name.toLowerCase().includes(item.query.toLowerCase()) || 
                r.code.toLowerCase().includes(item.query.toLowerCase())
              );
              if (match) handleSelectRoom(match);
            }}
            className={`px-2.5 py-1 rounded-lg border transition whitespace-nowrap font-medium cursor-pointer ${
              searchQuery.toLowerCase().includes(item.query.toLowerCase())
                ? 'bg-[#7A1F1E] text-white border-[#7A1F1E]'
                : theme === 'dark'
                  ? 'border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-300'
                  : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* SEARCH AND FILTER CONTROL STRIP */}
      <div className={`p-4 border-b flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs ${
        theme === 'dark' ? 'border-zinc-800/70 bg-zinc-950/40' : 'border-stone-200/70 bg-white/70'
      }`}>
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type room number (e.g. 116, 102, 12) or name (e.g. CV Raman, Library)..."
            className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs outline-none border transition ${
              theme === 'dark' 
                ? 'bg-zinc-900 border-zinc-800 focus:border-[#7A1F1E] text-white placeholder-zinc-500' 
                : 'bg-stone-50 border-stone-200 focus:border-[#7A1F1E] text-stone-800 placeholder-stone-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Block Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Block:</span>
          <select
            value={selectedBlockFilter}
            onChange={(e) => setSelectedBlockFilter(e.target.value as any)}
            className={`px-2.5 py-1.5 rounded-xl text-xs border outline-none cursor-pointer ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <option value="all">All Blocks (A, B, C)</option>
            <option value="block-a">Block A (CSE, IT, Admin)</option>
            <option value="block-b">Block B (Labs, Mech, Civil)</option>
            <option value="block-c">Block C (Library, EC)</option>
          </select>
        </div>

        {/* Floor Numbering Filter (Adhering to double digit on ground, 10x on second, 20x on third) */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0">Floor:</span>
          <select
            value={selectedFloorFilter}
            onChange={(e) => setSelectedFloorFilter(e.target.value as any)}
            className={`px-2.5 py-1.5 rounded-xl text-xs border outline-none cursor-pointer ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <option value="all">All Floors</option>
            <option value="0">Ground Floor (0x Double Digit)</option>
            <option value="1">1st Floor (10x Series - Lab 116 &amp; CV Raman)</option>
            <option value="2">2nd Floor (20x Series)</option>
          </select>
        </div>
      </div>

      {/* VIEWPORT CONTENT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* LEFT COLUMN: ROOM CATALOG LIST (4 Cols on LG) */}
        <div className={`lg:col-span-4 border-r flex flex-col ${
          theme === 'dark' ? 'border-zinc-800 bg-zinc-950/40' : 'border-stone-200 bg-[#FDFBF7]/60'
        }`}>
          <div className="p-3 border-b flex items-center justify-between text-[11px] text-stone-400">
            <span className="font-bold uppercase tracking-wider">
              Campus Rooms Found ({filteredRooms.length})
            </span>
            <span>Numbering: 0x, 10x, 20x</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[520px]">
            {filteredRooms.map((room) => {
              const isSelected = room.id === selectedRoomId;
              const isTarget116 = room.code.includes('116') || room.name.includes('CV Raman');

              return (
                <div
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'border-[#7A1F1E] bg-[#7A1F1E]/10 dark:bg-rose-950/25 shadow-xs'
                      : theme === 'dark'
                        ? 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
                        : 'border-stone-200/80 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isSelected 
                          ? 'bg-[#7A1F1E] text-white' 
                          : isTarget116
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : 'bg-stone-200/70 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300'
                      }`}>
                        {room.code}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {room.floorLabel.split(' (')[0]}
                      </span>
                    </div>

                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-500">
                      {room.blockName.split(' (')[0]}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold leading-snug ${
                    isSelected ? 'text-[#7A1F1E] dark:text-rose-400' : ''
                  }`}>
                    {room.name}
                  </h4>

                  <p className="text-[10px] text-stone-500 dark:text-zinc-400 line-clamp-1">
                    {room.description}
                  </p>
                </div>
              );
            })}

            {filteredRooms.length === 0 && (
              <div className="p-8 text-center text-stone-400">
                <Compass className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No rooms found matching "{searchQuery}".</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBlockFilter('all');
                    setSelectedFloorFilter('all');
                  }}
                  className="mt-2 text-xs font-bold text-[#7A1F1E] hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: MAIN INTERACTIVE VIEWPORT (8 Cols on LG) */}
        <div className="lg:col-span-8 flex flex-col">
          
          {/* TAB 1: TURN-BY-TURN NAVIGATION ASSISTANT */}
          {viewTab === 'navigator' && (
            <div className="p-5 flex-1 flex flex-col justify-between space-y-5 overflow-y-auto max-h-[580px]">
              
              {/* Highlight Banner of Selected Destination */}
              <div className={`p-4 rounded-2xl border ${
                theme === 'dark' 
                  ? 'bg-zinc-900/60 border-zinc-800 text-white' 
                  : 'bg-white border-stone-200 text-[#2D2A26]'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#7A1F1E] text-white text-[10px] font-mono font-bold">
                      {activeRoom.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {activeRoom.floorLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {activeRoom.blockName}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-stone-400">
                    {activeRoom.timings || 'Academic Hours'}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold">
                  {activeRoom.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {activeRoom.description}
                </p>

                {activeRoom.incharge && (
                  <div className="mt-2 text-[11px] text-stone-600 dark:text-zinc-300 flex items-center gap-1.5 font-medium">
                    <User className="w-3.5 h-3.5 text-[#7A1F1E]" />
                    <span>In-charge: <strong>{activeRoom.incharge}</strong></span>
                  </div>
                )}
              </div>

              {/* Start Point & Route Selector */}
              <div className="flex items-center gap-2 p-3 rounded-xl border border-stone-200/80 dark:border-zinc-800 bg-stone-100/50 dark:bg-zinc-900/50 text-xs">
                <Navigation className="w-4 h-4 text-[#7A1F1E] shrink-0" />
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Start Navigation From:</span>
                <select
                  value={navigationOrigin}
                  onChange={(e) => setNavigationOrigin(e.target.value)}
                  className="bg-transparent font-bold outline-none cursor-pointer pr-2 text-stone-800 dark:text-white"
                >
                  {origins.map((o) => (
                    <option key={o.id} value={o.id} className="dark:bg-zinc-900">
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Turn-by-Turn Wayfinding Steps */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A1F1E] dark:text-rose-400 flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>Step-by-Step Wayfinding Path</span>
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">
                    ~{activeRoom.directionsFromEntrance.length} checkpoints
                  </span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-300 dark:before:bg-zinc-800">
                  {activeRoom.directionsFromEntrance.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 text-xs leading-relaxed">
                      <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#7A1F1E] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-stone-200/70 dark:border-zinc-800 shadow-xs">
                        <span className="text-stone-800 dark:text-stone-200 font-medium">
                          {step}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features & Equipment Badges */}
              {activeRoom.features.length > 0 && (
                <div className="pt-2 border-t border-stone-200/80 dark:border-zinc-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                    Room Facilities &amp; Equipment:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeRoom.features.map((feat) => (
                      <span 
                        key={feat}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-zinc-800/80 text-[10px] font-medium text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700/60"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setViewTab('floorplan')}
                  className="px-4 py-2.5 rounded-xl bg-[#7A1F1E] hover:bg-[#5C1716] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View on 2D Floor Plan</span>
                </button>
                <button
                  onClick={() => setViewTab('map')}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-zinc-700 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View on Campus Map</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE 2D FLOOR PLAN SCHEMATIC */}
          {viewTab === 'floorplan' && (
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-serif text-base font-bold">
                      Acropolis Architectural Floor Schematic
                    </h3>
                    <p className="text-xs text-stone-400">
                      Select Block and Floor level to see real room matrices &amp; corridors.
                    </p>
                  </div>

                  {/* Block Tabs */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-200/70 dark:bg-zinc-900 border text-xs">
                    {[
                      { id: 'block-a', label: 'Block A (CSE/IT)' },
                      { id: 'block-b', label: 'Block B (Labs/Audi)' },
                      { id: 'block-c', label: 'Block C (Library)' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setActiveFloorBlock(b.id as any)}
                        className={`px-3 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                          activeFloorBlock === b.id
                            ? 'bg-[#7A1F1E] text-white shadow-xs'
                            : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Level Selector: 0x (Ground), 10x (1st Floor), 20x (2nd Floor) */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { level: 0, label: 'Ground Floor (0x Series)', sub: 'Rooms 01 - 25' },
                    { level: 1, label: '1st Floor (10x Series)', sub: 'Lab 116, CV Raman Lab 115' },
                    { level: 2, label: '2nd Floor (20x Series)', sub: 'Rooms 201 - 220' }
                  ].map((f) => (
                    <button
                      key={f.level}
                      onClick={() => setActiveFloorLevel(f.level as any)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                        activeFloorLevel === f.level
                          ? 'border-[#7A1F1E] bg-[#7A1F1E]/10 dark:bg-rose-950/30'
                          : theme === 'dark'
                            ? 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                            : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${
                        activeFloorLevel === f.level ? 'text-[#7A1F1E] dark:text-rose-400' : ''
                      }`}>
                        {f.label}
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5">
                        {f.sub}
                      </span>
                    </button>
                  ))}
                </div>

                {/* 2D Schematic Floor Map Canvas Grid */}
                <div className={`p-4 rounded-2xl border ${
                  theme === 'dark' ? 'border-zinc-800 bg-zinc-950' : 'border-stone-200 bg-[#FDFBF7]'
                }`}>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200/60 dark:border-zinc-800 text-[10px] font-mono text-stone-400">
                    <span>NORTH CORRIDOR WING</span>
                    <span className="font-bold text-[#7A1F1E] uppercase">
                      {activeFloorBlock.toUpperCase()} • FLOOR {activeFloorLevel}
                    </span>
                    <span>SOUTH STAIRCASE WING</span>
                  </div>

                  {/* Room Matrix layout */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Simulated rooms on this floor */}
                    {activeFloorLevel === 1 && activeFloorBlock === 'block-b' ? (
                      <>
                        {/* Room 115: CV Raman Lab */}
                        <div
                          onClick={() => {
                            const r = ACROPOLIS_CAMPUS_ROOMS.find((rm) => rm.id === 'b-cv-raman-lab');
                            if (r) handleSelectRoom(r);
                          }}
                          className={`p-3 rounded-xl border-2 transition cursor-pointer ${
                            selectedRoomId === 'b-cv-raman-lab'
                              ? 'border-[#7A1F1E] bg-[#7A1F1E]/15'
                              : 'border-amber-500/40 bg-amber-500/5 hover:border-amber-500'
                          }`}
                        >
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500">
                            ROOM 115
                          </span>
                          <h5 className="font-bold text-xs mt-1">C.V. Raman Physics Lab</h5>
                          <p className="text-[9px] text-stone-400 mt-0.5">Optics &amp; Lasers</p>
                        </div>

                        {/* Room 116: LAB 116 (Requested by user) */}
                        <div
                          onClick={() => {
                            const r = ACROPOLIS_CAMPUS_ROOMS.find((rm) => rm.id === 'b-lab-116');
                            if (r) handleSelectRoom(r);
                          }}
                          className={`p-3 rounded-xl border-2 transition cursor-pointer ${
                            selectedRoomId === 'b-lab-116'
                              ? 'border-[#7A1F1E] bg-[#7A1F1E]/20 shadow-md ring-2 ring-[#7A1F1E]'
                              : 'border-blue-500/50 bg-blue-500/10 hover:border-blue-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white">
                              LAB 116
                            </span>
                            <span className="text-[8px] font-bold text-blue-500 uppercase">Selected</span>
                          </div>
                          <h5 className="font-bold text-xs mt-1 text-[#7A1F1E] dark:text-rose-400">Advanced Prog. Lab</h5>
                          <p className="text-[9px] text-stone-400 mt-0.5">60 PCs • Linux Workstations</p>
                        </div>

                        {/* Room 117 */}
                        <div className="p-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-100/40 dark:bg-zinc-900/30 opacity-70">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-zinc-800 text-stone-500">
                            ROOM 117
                          </span>
                          <h5 className="font-bold text-xs mt-1">Tutorial Room</h5>
                          <p className="text-[9px] text-stone-400 mt-0.5">35 Capacity</p>
                        </div>

                        {/* Room 118 */}
                        <div className="p-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-100/40 dark:bg-zinc-900/30 opacity-70">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-zinc-800 text-stone-500">
                            ROOM 118
                          </span>
                          <h5 className="font-bold text-xs mt-1">Mechanical Faculty Cabin</h5>
                          <p className="text-[9px] text-stone-400 mt-0.5">Professors Desk</p>
                        </div>

                        {/* Room 119 */}
                        <div className="p-3 rounded-xl border border-stone-200 dark:border-zinc-800 bg-stone-100/40 dark:bg-zinc-900/30 opacity-70">
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-zinc-800 text-stone-500">
                            ROOM 119
                          </span>
                          <h5 className="font-bold text-xs mt-1">Classroom B-119</h5>
                          <p className="text-[9px] text-stone-400 mt-0.5">Lecture Hall</p>
                        </div>

                        {/* Central Corridor Node */}
                        <div className="p-3 rounded-xl border border-dashed border-stone-300 dark:border-zinc-700 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] font-bold text-stone-400 uppercase">Central Staircase</span>
                          <span className="text-[9px] text-stone-400">Leads to Floor 2 &amp; Ground</span>
                        </div>
                      </>
                    ) : (
                      schematicRooms.map((rm) => (
                        <div
                          key={rm.id}
                          onClick={() => handleSelectRoom(rm)}
                          className={`p-3 rounded-xl border transition cursor-pointer ${
                            selectedRoomId === rm.id
                              ? 'border-[#7A1F1E] bg-[#7A1F1E]/15'
                              : 'border-stone-200 dark:border-zinc-800 bg-stone-100/40 dark:bg-zinc-900/30 hover:border-[#7A1F1E]'
                          }`}
                        >
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#7A1F1E]/20 text-[#7A1F1E] dark:text-rose-400">
                            {rm.code}
                          </span>
                          <h5 className="font-bold text-xs mt-1 leading-tight">{rm.name}</h5>
                          <p className="text-[9px] text-stone-400 mt-0.5 line-clamp-1">{rm.description}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Corridor Path Representation */}
                  <div className="mt-4 p-2 rounded-lg bg-stone-200/50 dark:bg-zinc-900 text-center font-mono text-[9px] uppercase tracking-widest text-stone-400">
                    ◄ MAIN PASSAGEWAY &amp; WATER COOLER STATIONS ►
                  </div>
                </div>

              </div>

              {/* Bottom Nav CTA */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">
                  Currently selected: <strong>{activeRoom.name}</strong> ({activeRoom.code})
                </span>
                <button
                  onClick={() => setViewTab('navigator')}
                  className="px-4 py-2 rounded-xl bg-[#7A1F1E] text-white text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get Directions to this Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CAMPUS GOOGLE MAP VIEW */}
          {viewTab === 'map' && (
            <div className="h-[580px] w-full relative bg-stone-100 dark:bg-zinc-950">
              {!apiKey ? (
                <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center">
                  <MapPin className="w-10 h-10 text-[#7A1F1E] mb-2 animate-bounce" />
                  <p className="text-xs text-stone-400">Google Maps Platform initializing...</p>
                </div>
              ) : (
                <APIProvider apiKey={apiKey} solutionChannel="GMP_aistudio">
                  <Map
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    mapId="DEMO_MAP_ID"
                    defaultCenter={ACROPOLIS_CENTER}
                    defaultZoom={17}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    mapTypeControl={false}
                    streetViewControl={false}
                    style={{ width: '100%', height: '100%' }}
                  >
                    <MapCameraPan target={mapTarget} zoom={mapZoom} />

                    {/* THREE PRIMARY ACROPOLIS BLOCKS */}
                    {CAMPUS_BLOCKS.map((block) => (
                      <AdvancedMarker
                        key={block.id}
                        position={{ lat: block.lat, lng: block.lng }}
                        title={block.name}
                      >
                        <div className="px-2.5 py-1 rounded-xl bg-[#7A1F1E] text-white text-[10px] font-mono font-bold tracking-wider border-2 border-white shadow-lg pointer-events-none">
                          {block.name.split(' (')[0]}
                        </div>
                      </AdvancedMarker>
                    ))}

                    {/* SELECTED ROOM PIN */}
                    <AdvancedMarker
                      position={{ lat: activeRoom.lat, lng: activeRoom.lng }}
                      title={activeRoom.name}
                      onClick={() => setShowInfoWindow(true)}
                    >
                      <Pin
                        background="#7A1F1E"
                        borderColor="#FFFFFF"
                        glyphColor="#FFFFFF"
                        scale={1.35}
                      />
                    </AdvancedMarker>

                    {/* INFOWINDOW ON SELECTED ROOM */}
                    {showInfoWindow && (
                      <InfoWindow
                        position={{ lat: activeRoom.lat, lng: activeRoom.lng }}
                        onCloseClick={() => setShowInfoWindow(false)}
                        maxWidth={300}
                      >
                        <div className="p-1.5 font-sans text-[#2D2A26]">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-100 text-[#7A1F1E]">
                              {activeRoom.code}
                            </span>
                            <span className="text-[9px] font-mono text-stone-500">
                              {activeRoom.floorLabel}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs leading-tight mb-1">
                            {activeRoom.name}
                          </h4>
                          <p className="text-[10px] text-stone-600 mb-2 leading-tight">
                            {activeRoom.description}
                          </p>

                          <button
                            onClick={() => setViewTab('navigator')}
                            className="w-full py-1.5 rounded-md bg-[#7A1F1E] text-white text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 hover:bg-[#5C1716] transition cursor-pointer"
                          >
                            <span>Open Turn-by-Turn Wayfinding</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
