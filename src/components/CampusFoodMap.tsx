import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  UtensilsCrossed, 
  Coffee, 
  Sparkles, 
  DollarSign, 
  Layers, 
  ExternalLink, 
  Check, 
  ChevronRight, 
  Compass, 
  RotateCcw,
  Maximize2, 
  Minimize2, 
  AlertTriangle,
  ArrowLeft,
  Building,
  Cpu,
  BookOpen,
  GraduationCap,
  Info,
  X,
  Phone,
  User,
  CheckCircle2
} from 'lucide-react';
import { 
  CAMPUS_FOOD_SPOTS, 
  CAMPUS_BLOCKS, 
  ACROPOLIS_CENTER, 
  FoodSpot, 
  CampusBlock,
  FoodDish,
  calculateDistanceMeters, 
  calculateWalkTimeMinutes 
} from '../data/campusFoodData';
import { ACROPOLIS_CAMPUS_ROOMS, CampusRoom } from '../data/campusRoomsData';

// Map Camera Pan Helper
function MapCameraController({
  target,
  zoom
}: {
  target: { lat: number; lng: number } | null;
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !target) return;
    map.panTo(target);
    if (zoom) {
      map.setZoom(zoom);
    }
  }, [map, target, zoom]);

  return null;
}

interface CampusFoodMapProps {
  theme: 'dark' | 'light';
  initialQuery?: string;
  onSelectDishForSearch?: (dishName: string, maxBudget: number) => void;
  onBackToDashboard?: () => void;
}

export default function CampusFoodMap({ 
  theme, 
  initialQuery = '',
  onSelectDishForSearch,
  onBackToDashboard
}: CampusFoodMapProps) {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '';

  // Mode Tabs: 'map' (Unified Live Map) | 'floorplan' (2D Floor Schematic) | 'menu' (Canteen Menus & Budget)
  const [activeViewMode, setActiveViewMode] = useState<'map' | 'floorplan' | 'menu'>('map');

  // Unified Search State (searches both food items and rooms/labs/offices)
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Filter Categories: 'all' | 'food' | 'labs' | 'classes' | 'offices'
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  
  // Block & Floor Filters for Academic Facilities
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<'all' | 'block-a' | 'block-b' | 'block-c'>('all');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<'all' | '0' | '1' | '2'>('all');
  
  // Food Specific Filters
  const [maxBudgetFilter, setMaxBudgetFilter] = useState<number>(200);
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);

  // Origin point for distance/walk calculations
  const [selectedOrigin, setSelectedOrigin] = useState<CampusBlock>(CAMPUS_BLOCKS[0]);
  const [userGpsLocation, setUserGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Selected Items for Detail Inspection & Map InfoWindows
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(CAMPUS_FOOD_SPOTS[0].id);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(true);

  // 2D Schematic Floor selection
  const [schematicBlock, setSchematicBlock] = useState<'block-b' | 'block-a' | 'block-c'>('block-b');
  const [schematicFloor, setSchematicFloor] = useState<0 | 1 | 2>(1); // 1 = 1st Floor (10x, includes Lab 116 & CV Raman)

  // Fullscreen expansion mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Camera focus state
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lng: number } | null>(ACROPOLIS_CENTER);
  const [cameraZoom, setCameraZoom] = useState<number>(17);

  // Quota exceeded listener
  const [hasQuotaError, setHasQuotaError] = useState(false);
  useEffect(() => {
    const handleQuota = () => setHasQuotaError(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Update search when initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  // Handle GPS location
  const handleGetLiveLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocatingUser(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserGpsLocation(coords);
        setCameraTarget(coords);
        setCameraZoom(18);
      },
      () => {
        setIsLocatingUser(false);
      },
      { timeout: 8000 }
    );
  }, []);

  // Active Origin Coordinates
  const currentOriginCoords = useMemo(() => {
    if (userGpsLocation) return userGpsLocation;
    return { lat: selectedOrigin.lat, lng: selectedOrigin.lng };
  }, [userGpsLocation, selectedOrigin]);

  // Enriched Food Spots with dynamic walking metrics
  const enrichedFoodSpots = useMemo(() => {
    return CAMPUS_FOOD_SPOTS.map((spot) => {
      const distance = calculateDistanceMeters(
        currentOriginCoords.lat,
        currentOriginCoords.lng,
        spot.lat,
        spot.lng
      );
      const walkTime = calculateWalkTimeMinutes(distance);
      return {
        ...spot,
        dynamicDistanceMeters: distance,
        dynamicWalkTimeMinutes: walkTime
      };
    });
  }, [currentOriginCoords]);

  // Filtered Food Spots
  const filteredFoodSpots = useMemo(() => {
    if (activeCategoryFilter === 'labs' || activeCategoryFilter === 'classes' || activeCategoryFilter === 'offices') {
      return [];
    }
    return enrichedFoodSpots.filter((spot) => {
      if (spot.averagePrice > maxBudgetFilter) return false;
      if (onlyOpenNow && !spot.isOpenNow) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = spot.name.toLowerCase().includes(query);
        const matchesCategory = spot.categoryLabel.toLowerCase().includes(query);
        const matchesLocation = spot.locationDescription.toLowerCase().includes(query);
        const matchesDish = spot.popularDishes.some((d) => 
          d.name.toLowerCase().includes(query) || d.category.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesCategory && !matchesLocation && !matchesDish) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => a.dynamicDistanceMeters - b.dynamicDistanceMeters);
  }, [enrichedFoodSpots, activeCategoryFilter, maxBudgetFilter, onlyOpenNow, searchQuery]);

  // Filtered Campus Rooms & Labs
  const filteredCampusRooms = useMemo(() => {
    if (activeCategoryFilter === 'food') {
      return [];
    }
    return ACROPOLIS_CAMPUS_ROOMS.filter((room) => {
      if (activeCategoryFilter === 'labs' && room.category !== 'lab') return false;
      if (activeCategoryFilter === 'classes' && room.category !== 'classroom' && room.category !== 'hall') return false;
      if (activeCategoryFilter === 'offices' && room.category !== 'office' && room.category !== 'facility') return false;

      if (selectedBlockFilter !== 'all' && room.blockId !== selectedBlockFilter) return false;
      if (selectedFloorFilter !== 'all' && room.floor !== Number(selectedFloorFilter)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = room.name.toLowerCase().includes(q);
        const matchCode = room.code.toLowerCase().includes(q);
        const matchDesc = room.description.toLowerCase().includes(q);
        const matchBlock = room.blockName.toLowerCase().includes(q);
        const matchFloor = room.floorLabel.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchDesc && !matchBlock && !matchFloor) {
          return false;
        }
      }
      return true;
    });
  }, [activeCategoryFilter, selectedBlockFilter, selectedFloorFilter, searchQuery]);

  // Active Selected Food Spot
  const activeSpot = useMemo(() => {
    return enrichedFoodSpots.find((s) => s.id === selectedSpotId) || null;
  }, [enrichedFoodSpots, selectedSpotId]);

  // Active Selected Room
  const activeRoom = useMemo(() => {
    return ACROPOLIS_CAMPUS_ROOMS.find((r) => r.id === selectedRoomId) || null;
  }, [selectedRoomId]);

  // Rooms belonging to current 2D schematic block & floor
  const schematicFloorRooms = useMemo(() => {
    return ACROPOLIS_CAMPUS_ROOMS.filter(
      (r) => r.blockId === schematicBlock && r.floor === schematicFloor
    );
  }, [schematicBlock, schematicFloor]);

  // Click Handlers
  const handleSpotClick = (spot: FoodSpot) => {
    setSelectedSpotId(spot.id);
    setSelectedRoomId(null);
    setShowInfoWindow(true);
    setCameraTarget({ lat: spot.lat, lng: spot.lng });
    setCameraZoom(18);
  };

  const handleRoomClick = (room: CampusRoom) => {
    setSelectedRoomId(room.id);
    setSelectedSpotId(null);
    setShowInfoWindow(true);
    setCameraTarget({ lat: room.lat, lng: room.lng });
    setCameraZoom(18);
    setSchematicBlock(room.blockId);
    setSchematicFloor(room.floor);
  };

  const handleResetCamera = () => {
    setCameraTarget(ACROPOLIS_CENTER);
    setCameraZoom(17);
    setShowInfoWindow(false);
  };

  // Quick preset queries
  const popularPresets = [
    { label: 'Lab 116 (Second Block)', query: '116', type: 'room' },
    { label: 'CV Raman Physics Lab', query: 'CV Raman', type: 'room' },
    { label: 'Indore Bakesamosa (₹20)', query: 'Bakesamosa', type: 'food' },
    { label: 'Campus Nescafe', query: 'Nescafe', type: 'food' },
    { label: 'Alan Turing AI Lab', query: 'Turing', type: 'room' },
    { label: 'Central Library (Block C)', query: 'Library', type: 'room' },
    { label: 'Ground Floor 0x Labs', query: '0', type: 'floor' },
    { label: 'Indori Poha & Jalebi', query: 'Poha', type: 'food' }
  ];

  return (
    <div className={`w-full rounded-3xl overflow-hidden border transition-all ${
      theme === 'dark' 
        ? 'bg-[#121215] border-zinc-800 text-zinc-100 shadow-xl' 
        : 'bg-white border-stone-200 text-[#2D2A26] shadow-sm'
    } ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''}`}>

      {/* TOP BAR WITH CRITICAL 'RETURN TO DASHBOARD' HYPERLINK & BREADCRUMBS */}
      <div className={`px-4 py-3.5 md:px-6 border-b flex flex-wrap items-center justify-between gap-3 ${
        theme === 'dark' ? 'border-zinc-800/80 bg-zinc-950/90' : 'border-stone-200/80 bg-[#FAF7F2]'
      }`}>
        {/* Left: Breadcrumbs & Return Button */}
        <div className="flex items-center gap-3">
          {onBackToDashboard ? (
            <button
              onClick={onBackToDashboard}
              type="button"
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                theme === 'dark'
                  ? 'border-zinc-800 bg-zinc-900 text-rose-300 hover:bg-[#7A1F1E] hover:text-white'
                  : 'border-stone-200 bg-white text-[#7A1F1E] hover:bg-[#7A1F1E] hover:text-white'
              }`}
              title="Return to Main Dashboard Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="font-semibold">← Return to Dashboard</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7A1F1E]">
              <Compass className="w-4 h-4" />
              <span>Campus OS</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400 dark:text-zinc-500 font-mono">
            <span>/</span>
            <span className="text-stone-700 dark:text-zinc-300 font-medium font-sans">
              Acropolis Indore Campus Navigator &amp; Food Locator
            </span>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center p-1 rounded-2xl bg-stone-200/70 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setActiveViewMode('map')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'map'
                ? 'bg-[#7A1F1E] text-white shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Interactive Map</span>
          </button>

          <button
            onClick={() => setActiveViewMode('floorplan')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'floorplan'
                ? 'bg-[#7A1F1E] text-white shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Floor Plans (3 Blocks)</span>
          </button>

          <button
            onClick={() => setActiveViewMode('menu')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeViewMode === 'menu'
                ? 'bg-[#7A1F1E] text-white shadow-xs'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Canteen Menus (₹)</span>
          </button>
        </div>

        {/* Right Tools: Fullscreen & Live GPS */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetCamera}
            type="button"
            className={`p-2 rounded-xl border text-stone-500 hover:text-stone-900 dark:hover:text-white transition cursor-pointer ${
              theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-stone-200 bg-white'
            }`}
            title="Reset Map to Campus Center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            type="button"
            className={`p-2 rounded-xl border text-stone-500 hover:text-stone-900 dark:hover:text-white transition cursor-pointer ${
              theme === 'dark' ? 'border-zinc-800 bg-zinc-900' : 'border-stone-200 bg-white'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* UNIFIED SEARCH BAR & CATEGORY FILTER STRIP */}
      <div className={`p-4 md:px-6 border-b flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs ${
        theme === 'dark' ? 'border-zinc-800/80 bg-zinc-900/60' : 'border-stone-200/80 bg-white'
      }`}>
        {/* Unified Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Lab 116, CV Raman, Room 102, Library, Bakesamosa, Poha, Chai, Nescafe..."
            className={`w-full pl-10 pr-9 py-2.5 rounded-xl text-xs outline-none border transition ${
              theme === 'dark' 
                ? 'bg-zinc-950 border-zinc-700 focus:border-rose-500 text-white placeholder-zinc-500' 
                : 'bg-[#FAF7F2] border-stone-200 focus:border-[#7A1F1E] text-stone-800 placeholder-stone-400'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs cursor-pointer p-1"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: `All (${filteredFoodSpots.length + filteredCampusRooms.length})` },
            { id: 'food', label: `🍔 Food & Canteens (${filteredFoodSpots.length})` },
            { id: 'labs', label: '🔬 Labs & Research' },
            { id: 'classes', label: '🏫 Classrooms & Halls' },
            { id: 'offices', label: '🏢 Offices & Help Desks' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-semibold transition cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-[#7A1F1E] text-white shadow-xs'
                  : theme === 'dark'
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Block & Floor Dropdowns (for Room navigation) */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedBlockFilter}
            onChange={(e) => setSelectedBlockFilter(e.target.value as any)}
            className={`px-2.5 py-1.5 rounded-xl text-xs border outline-none cursor-pointer ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
            title="Filter by Campus Block"
          >
            <option value="all">All 3 Blocks</option>
            <option value="block-b">Block B (Second Block - Lab 116)</option>
            <option value="block-a">Block A (First Block - Admin/CSE)</option>
            <option value="block-c">Block C (Third Block - Library)</option>
          </select>

          <select
            value={selectedFloorFilter}
            onChange={(e) => setSelectedFloorFilter(e.target.value as any)}
            className={`px-2.5 py-1.5 rounded-xl text-xs border outline-none cursor-pointer ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
            title="Filter by Floor Numbering Pattern"
          >
            <option value="all">All 3 Floors</option>
            <option value="0">Ground Floor (0x Double-Digit)</option>
            <option value="1">1st Floor (10x Series)</option>
            <option value="2">2nd Floor (20x Series)</option>
          </select>
        </div>
      </div>

      {/* QUICK PRESETS CHIPS */}
      <div className={`px-4 py-2 border-b flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none ${
        theme === 'dark' ? 'border-zinc-800/60 bg-zinc-950/40' : 'border-stone-200/60 bg-[#FAF7F2]/60'
      }`}>
        <span className="text-stone-400 font-bold uppercase tracking-wider text-[9px] shrink-0">Instant Match:</span>
        {popularPresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setSearchQuery(preset.query);
              if (preset.type === 'room') {
                const roomMatch = ACROPOLIS_CAMPUS_ROOMS.find((r) => 
                  r.name.toLowerCase().includes(preset.query.toLowerCase()) || 
                  r.code.toLowerCase().includes(preset.query.toLowerCase())
                );
                if (roomMatch) handleRoomClick(roomMatch);
              } else if (preset.type === 'food') {
                const foodMatch = enrichedFoodSpots.find((s) => 
                  s.name.toLowerCase().includes(preset.query.toLowerCase()) ||
                  s.popularDishes.some(d => d.name.toLowerCase().includes(preset.query.toLowerCase()))
                );
                if (foodMatch) handleSpotClick(foodMatch);
              }
            }}
            className={`px-2.5 py-1 rounded-lg border transition whitespace-nowrap font-medium cursor-pointer ${
              searchQuery.toLowerCase().includes(preset.query.toLowerCase())
                ? 'bg-[#7A1F1E] text-white border-[#7A1F1E]'
                : theme === 'dark'
                  ? 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                  : 'border-stone-200 bg-white hover:bg-stone-100 text-stone-700'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* MAIN VIEWPORT LAYOUT */}
      {activeViewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 h-[640px] max-md:h-[840px] relative">
          
          {/* LEFT: INTERACTIVE GOOGLE MAP (7 COLS) */}
          <div className="lg:col-span-7 h-full relative overflow-hidden bg-stone-100 dark:bg-zinc-950">
            
            {hasQuotaError && (
              <div className="absolute top-3 inset-x-3 z-30 p-2.5 rounded-xl bg-amber-500 text-white text-xs font-medium flex items-center gap-2 shadow-md">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Google Maps quota limit reached. Viewing offline geo-cache points for Acropolis.</span>
              </div>
            )}

            {!apiKey ? (
              <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-stone-100 dark:bg-zinc-900">
                <MapPin className="w-12 h-12 text-[#7A1F1E] mb-3 animate-bounce" />
                <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-100">
                  Maps API Key Initializing
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mt-1">
                  Connecting to Google Maps Platform service for Acropolis Indore (Manglia Bypass).
                </p>
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
                  <MapCameraController target={cameraTarget} zoom={cameraZoom} />

                  {/* USER / ORIGIN LOCATION MARKER */}
                  <AdvancedMarker
                    position={currentOriginCoords}
                    title={`Your Location: ${userGpsLocation ? 'Live GPS' : selectedOrigin.name}`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-emerald-400 opacity-75" />
                      <div className="relative w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg font-bold text-xs">
                        📍
                      </div>
                    </div>
                  </AdvancedMarker>

                  {/* CAMPUS 3 BLOCKS LABELS */}
                  {CAMPUS_BLOCKS.map((block) => (
                    <AdvancedMarker
                      key={block.id}
                      position={{ lat: block.lat, lng: block.lng }}
                      title={block.name}
                    >
                      <div className="px-2 py-0.5 rounded-md bg-stone-900/90 text-amber-300 text-[9px] font-mono font-bold tracking-wider border border-amber-400/30 shadow-md pointer-events-none">
                        {block.name.split(' (')[0].toUpperCase()}
                      </div>
                    </AdvancedMarker>
                  ))}

                  {/* FOOD SPOTS MARKERS (Maroon / Red pins) */}
                  {filteredFoodSpots.map((spot) => {
                    const isSelected = spot.id === selectedSpotId;
                    return (
                      <AdvancedMarker
                        key={spot.id}
                        position={{ lat: spot.lat, lng: spot.lng }}
                        onClick={() => handleSpotClick(spot)}
                        title={spot.name}
                      >
                        <div className="flex flex-col items-center cursor-pointer group">
                          <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider shadow-sm transition-all ${
                            isSelected 
                              ? 'bg-[#7A1F1E] text-white scale-110 ring-2 ring-rose-400' 
                              : 'bg-stone-900/80 text-stone-100 group-hover:bg-[#7A1F1E]'
                          }`}>
                            🍔 {spot.name.split(' ')[0]}
                          </div>
                          <Pin
                            background={isSelected ? '#7A1F1E' : '#991B1B'}
                            borderColor="#FFFFFF"
                            glyphColor="#FFFFFF"
                            scale={isSelected ? 1.15 : 0.95}
                          />
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* CAMPUS ROOMS & LABS MARKERS (Blue / Indigo pins with Badges) */}
                  {filteredCampusRooms.map((room) => {
                    const isSelected = room.id === selectedRoomId;
                    const isLab116OrCV = room.id === 'b-lab-116' || room.id === 'b-cv-raman-lab';

                    return (
                      <AdvancedMarker
                        key={room.id}
                        position={{ lat: room.lat, lng: room.lng }}
                        onClick={() => handleRoomClick(room)}
                        title={`${room.code} - ${room.name}`}
                      >
                        <div className="flex flex-col items-center cursor-pointer group">
                          <div className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold tracking-wider shadow-md border transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-white scale-115 ring-2 ring-blue-300'
                              : isLab116OrCV
                                ? 'bg-indigo-700 text-white border-indigo-300 animate-pulse'
                                : 'bg-blue-900/90 text-blue-100 border-blue-400/40 group-hover:bg-blue-600'
                          }`}>
                            {room.code}
                          </div>
                          <Pin
                            background={isSelected ? '#2563EB' : isLab116OrCV ? '#4F46E5' : '#1D4ED8'}
                            borderColor="#DBEAFE"
                            glyphColor="#FFFFFF"
                            scale={isSelected ? 1.15 : 0.9}
                          />
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* INFOWINDOW FOR SELECTED FOOD SPOT */}
                  {showInfoWindow && activeSpot && (
                    <InfoWindow
                      position={{ lat: activeSpot.lat, lng: activeSpot.lng }}
                      onCloseClick={() => setShowInfoWindow(false)}
                      maxWidth={290}
                    >
                      <div className="p-1 font-sans text-stone-900">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-rose-100 text-[#7A1F1E]">
                            {activeSpot.categoryLabel}
                          </span>
                          <span className="flex items-center text-[10px] font-bold text-amber-600">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                            {activeSpot.rating}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs leading-tight mb-0.5">
                          {activeSpot.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 mb-2 leading-tight">
                          {activeSpot.locationDescription}
                        </p>
                        
                        <div className="flex items-center justify-between text-[10px] bg-stone-100 p-1.5 rounded-lg mb-2">
                          <span className="font-semibold text-stone-700 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#7A1F1E]" />
                            {activeSpot.dynamicWalkTimeMinutes}m walk ({activeSpot.dynamicDistanceMeters}m)
                          </span>
                          <span className="font-bold text-[#7A1F1E]">
                            Avg: ₹{activeSpot.averagePrice}
                          </span>
                        </div>

                        <div className="text-[10px] text-stone-600 mb-2">
                          <span className="font-semibold text-[#7A1F1E]">Bestseller: </span>
                          {activeSpot.popularDishes[0]?.name} (₹{activeSpot.popularDishes[0]?.price})
                        </div>

                        <div className="flex gap-1.5">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${activeSpot.lat},${activeSpot.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 rounded-md bg-[#7A1F1E] text-white text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 hover:bg-[#5C1716] transition"
                          >
                            <span>Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {onSelectDishForSearch && (
                            <button
                              onClick={() => onSelectDishForSearch(activeSpot.popularDishes[0]?.name || activeSpot.name, activeSpot.averagePrice)}
                              className="px-2 py-1.5 rounded-md border border-stone-300 text-stone-700 hover:bg-stone-100 text-[10px] font-bold uppercase transition"
                            >
                              Copilot
                            </button>
                          )}
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                  {/* INFOWINDOW FOR SELECTED CAMPUS ROOM / LAB */}
                  {showInfoWindow && activeRoom && (
                    <InfoWindow
                      position={{ lat: activeRoom.lat, lng: activeRoom.lng }}
                      onCloseClick={() => setShowInfoWindow(false)}
                      maxWidth={320}
                    >
                      <div className="p-1 font-sans text-stone-900">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-blue-100 text-blue-800">
                            {activeRoom.code}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[8px] font-mono text-purple-700 bg-purple-50">
                            {activeRoom.floorLabel}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs leading-tight mb-1">
                          {activeRoom.name}
                        </h4>
                        <p className="text-[10px] text-stone-600 mb-2 leading-tight">
                          {activeRoom.description}
                        </p>

                        <div className="text-[10px] bg-blue-50 border border-blue-100 p-2 rounded-lg mb-2">
                          <p className="font-bold text-blue-900 mb-1 flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-blue-600" />
                            <span>Walking Directions:</span>
                          </p>
                          <p className="text-[9px] text-blue-800 leading-snug">
                            {activeRoom.directionsFromEntrance[0]}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-stone-500 mb-2">
                          <span>📍 {activeRoom.blockName}</span>
                          {activeRoom.incharge && <span>👤 {activeRoom.incharge.split(' ')[1]}</span>}
                        </div>

                        <button
                          onClick={() => {
                            setSchematicBlock(activeRoom.blockId);
                            setSchematicFloor(activeRoom.floor);
                            setActiveViewMode('floorplan');
                          }}
                          className="w-full py-1.5 rounded-md bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 hover:bg-blue-700 transition cursor-pointer"
                        >
                          <Layers className="w-3 h-3" />
                          <span>View 2D Floor Schematic</span>
                        </button>
                      </div>
                    </InfoWindow>
                  )}

                </Map>
              </APIProvider>
            )}

            {/* MAP BOTTOM BAR: QUICK RE-CENTER PILLS */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto overflow-x-auto pb-1">
                <button
                  onClick={() => {
                    const lab116 = ACROPOLIS_CAMPUS_ROOMS.find((r) => r.id === 'b-lab-116');
                    if (lab116) handleRoomClick(lab116);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-stone-200 dark:border-zinc-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400 shadow-md hover:border-blue-500 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  <span>Go to Lab 116 (Block B)</span>
                </button>

                <button
                  onClick={() => {
                    const cvRaman = ACROPOLIS_CAMPUS_ROOMS.find((r) => r.id === 'b-cv-raman-lab');
                    if (cvRaman) handleRoomClick(cvRaman);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-stone-200 dark:border-zinc-800 text-[11px] font-semibold text-purple-600 dark:text-purple-400 shadow-md hover:border-purple-500 flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>C.V. Raman Physics Lab</span>
                </button>

                <button
                  onClick={() => {
                    const canteen = enrichedFoodSpots.find((s) => s.id === 'manasvi-canteen');
                    if (canteen) handleSpotClick(canteen);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-stone-200 dark:border-zinc-800 text-[11px] font-semibold text-[#7A1F1E] dark:text-rose-400 shadow-md hover:border-[#7A1F1E] flex items-center gap-1.5 cursor-pointer transition"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-[#7A1F1E]" />
                  <span>Manasvi Canteen (₹20 Samosa)</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center px-2 py-1 rounded-lg bg-stone-900/80 text-white text-[10px] font-mono pointer-events-auto">
                <span>{filteredFoodSpots.length} food · {filteredCampusRooms.length} rooms</span>
              </div>
            </div>

          </div>

          {/* RIGHT: CONNECTED DETAIL & LISTING PANEL (5 COLS) */}
          <div className={`lg:col-span-5 h-full flex flex-col border-t lg:border-t-0 lg:border-l overflow-hidden ${
            theme === 'dark' ? 'border-zinc-800 bg-[#141417]' : 'border-stone-200 bg-white'
          }`}>
            
            {/* ACTIVE SELECTION DETAIL PREVIEW CARD */}
            {activeRoom ? (
              <div className={`p-4 border-b shrink-0 ${
                theme === 'dark' ? 'border-zinc-800 bg-zinc-900/50' : 'border-stone-200 bg-[#FAF7F2]'
              }`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {activeRoom.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        {activeRoom.floorLabel}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold leading-snug">
                      {activeRoom.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                      {activeRoom.description}
                    </p>
                  </div>
                  <Building className="w-5 h-5 text-blue-600 shrink-0" />
                </div>

                {/* Step-by-Step Directions */}
                <div className="my-2.5 p-3 rounded-xl bg-blue-50/70 dark:bg-zinc-900 border border-blue-200/60 dark:border-zinc-800">
                  <span className="text-[10px] font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>How to Reach (From Main Entrance):</span>
                  </span>
                  <ol className="space-y-1.5 text-xs text-stone-700 dark:text-zinc-300">
                    {activeRoom.directionsFromEntrance.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-tight">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[11px] text-stone-500 dark:text-zinc-400">
                    Faculty: <strong className="text-stone-800 dark:text-stone-200">{activeRoom.incharge || 'Department Staff'}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setSchematicBlock(activeRoom.blockId);
                      setSchematicFloor(activeRoom.floor);
                      setActiveViewMode('floorplan');
                    }}
                    className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-700 transition cursor-pointer"
                  >
                    Open 2D Schematic
                  </button>
                </div>
              </div>
            ) : activeSpot ? (
              <div className={`p-4 border-b shrink-0 ${
                theme === 'dark' ? 'border-zinc-800 bg-zinc-900/50' : 'border-stone-200 bg-[#FAF7F2]'
              }`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-rose-100 text-[#7A1F1E] dark:bg-rose-950 dark:text-rose-300">
                        {activeSpot.categoryLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {activeSpot.openingHours}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-bold leading-snug">
                      {activeSpot.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                      {activeSpot.tagline}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="flex items-center justify-end text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                      {activeSpot.rating}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      Avg ₹{activeSpot.averagePrice}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 my-2 p-2 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#7A1F1E]" />
                    <span className="font-bold text-[#7A1F1E] dark:text-rose-400">
                      ~{activeSpot.dynamicWalkTimeMinutes}m walk ({activeSpot.dynamicDistanceMeters}m)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-l pl-2 border-stone-200 dark:border-zinc-800">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {activeSpot.priceRange}
                    </span>
                  </div>
                </div>

                {/* Popular Dishes */}
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {activeSpot.popularDishes.map((dish) => (
                    <div 
                      key={dish.id}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-stone-100/70 dark:bg-zinc-800/60 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dish.dietType === 'Veg' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="truncate font-medium">{dish.name}</span>
                      </div>
                      <span className="font-serif font-bold text-[#7A1F1E] dark:text-rose-400">
                        ₹{dish.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* SCROLLABLE UNIFIED RESULTS LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                <span>Matching Campus Locations &amp; Food ({filteredFoodSpots.length + filteredCampusRooms.length})</span>
              </div>

              {/* ROOMS & LABS RESULTS */}
              {filteredCampusRooms.map((room) => {
                const isSelected = room.id === selectedRoomId;
                const isLab116OrCV = room.id === 'b-lab-116' || room.id === 'b-cv-raman-lab';

                return (
                  <div
                    key={room.id}
                    onClick={() => handleRoomClick(room)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                        : theme === 'dark'
                          ? 'border-zinc-800/80 bg-zinc-900/40 hover:border-blue-500/40'
                          : 'border-stone-200/80 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isLab116OrCV 
                          ? 'bg-indigo-600 text-white font-bold' 
                          : 'bg-blue-600/10 text-blue-600'
                      }`}>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            {room.code}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {room.floorLabel.split(' (')[0]}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate">
                          {room.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 dark:text-zinc-400 truncate">
                          {room.blockName}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-2 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold uppercase shrink-0"
                    >
                      Guide
                    </button>
                  </div>
                );
              })}

              {/* FOOD SPOTS RESULTS */}
              {filteredFoodSpots.map((spot) => {
                const isSelected = spot.id === selectedSpotId;

                return (
                  <div
                    key={spot.id}
                    onClick={() => handleSpotClick(spot)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#7A1F1E] bg-[#7A1F1E]/5 shadow-sm'
                        : theme === 'dark'
                          ? 'border-zinc-800/80 bg-zinc-900/40 hover:border-[#7A1F1E]/40'
                          : 'border-stone-200/80 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7A1F1E] to-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                        <UtensilsCrossed className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-100 text-[#7A1F1E] dark:bg-rose-950 dark:text-rose-300">
                            {spot.categoryLabel}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            ~{spot.dynamicWalkTimeMinutes}m walk
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate">
                          {spot.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 dark:text-zinc-400 truncate">
                          Top: {spot.popularDishes[0]?.name} (₹{spot.popularDishes[0]?.price})
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-serif font-bold text-[#7A1F1E] dark:text-rose-400 block">
                        ₹{spot.averagePrice}
                      </span>
                      <span className="text-[9px] text-stone-400">Avg Cost</span>
                    </div>
                  </div>
                );
              })}

              {filteredFoodSpots.length === 0 && filteredCampusRooms.length === 0 && (
                <div className="p-8 text-center text-stone-400">
                  <Compass className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No matching food spots or campus rooms found for "{searchQuery}".</p>
                  <p className="text-[10px] mt-1">Try searching "116", "CV Raman", "Bakesamosa", "Library", or "Nescafe".</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEW 2: 2D FLOOR SCHEMATICS (3 BLOCKS & 3 FLOORS) */}
      {activeViewMode === 'floorplan' && (
        <div className="p-5 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-zinc-800">
            <div>
              <h3 className="font-serif text-xl font-bold">
                2D Interactive Campus Floor Schematic
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                Acropolis 3-Block Matrix: Ground Floor (0x), 1st Floor (10x Series e.g. Lab 116), 2nd Floor (20x Series)
              </p>
            </div>

            {/* Block & Floor Switchers */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Block Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs font-bold">
                <button
                  onClick={() => setSchematicBlock('block-b')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    schematicBlock === 'block-b' ? 'bg-[#7A1F1E] text-white shadow-xs' : 'text-stone-600 dark:text-zinc-400'
                  }`}
                >
                  Block B (Second Block - Lab 116)
                </button>
                <button
                  onClick={() => setSchematicBlock('block-a')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    schematicBlock === 'block-a' ? 'bg-[#7A1F1E] text-white shadow-xs' : 'text-stone-600 dark:text-zinc-400'
                  }`}
                >
                  Block A (First Block)
                </button>
                <button
                  onClick={() => setSchematicBlock('block-c')}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    schematicBlock === 'block-c' ? 'bg-[#7A1F1E] text-white shadow-xs' : 'text-stone-600 dark:text-zinc-400'
                  }`}
                >
                  Block C (Library)
                </button>
              </div>

              {/* Floor Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-xs font-bold">
                <button
                  onClick={() => setSchematicFloor(0)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    schematicFloor === 0 ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 dark:text-zinc-400'
                  }`}
                >
                  Ground (0x)
                </button>
                <button
                  onClick={() => setSchematicFloor(1)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    schematicFloor === 1 ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 dark:text-zinc-400'
                  }`}
                >
                  1st Floor (10x)
                </button>
                <button
                  onClick={() => setSchematicFloor(2)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    schematicFloor === 2 ? 'bg-blue-600 text-white shadow-xs' : 'text-stone-600 dark:text-zinc-400'
                  }`}
                >
                  2nd Floor (20x)
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Blueprint Canvas Layout */}
          <div className={`p-6 rounded-3xl border ${
            theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-[#FAF7F2] border-stone-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                Schematic: {schematicBlock.toUpperCase()} · Level {schematicFloor} ({schematicFloor === 0 ? 'Ground 0x' : schematicFloor === 1 ? '1st Floor 10x' : '2nd Floor 20x'})
              </span>
              <span className="text-[11px] font-medium text-emerald-600">
                ● Live Active Corridor
              </span>
            </div>

            {/* 2D Rooms Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {schematicFloorRooms.map((room) => {
                const isSelected = room.id === selectedRoomId;
                const isTarget116 = room.code === 'Lab 116';

                return (
                  <div
                    key={room.id}
                    onClick={() => {
                      handleRoomClick(room);
                      setActiveViewMode('map');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected || isTarget116
                        ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
                        : theme === 'dark'
                          ? 'border-zinc-800 bg-zinc-900/60 hover:border-blue-500/40'
                          : 'border-stone-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    {isTarget116 && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[8px] font-mono font-black uppercase">
                        Primary Target
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                        {room.code}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {room.categoryLabel}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-stone-800 dark:text-stone-100 mb-1 leading-snug">
                      {room.name}
                    </h4>

                    <p className="text-xs text-stone-500 dark:text-zinc-400 mb-3 leading-relaxed">
                      {room.description}
                    </p>

                    <div className="pt-2 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                      <span className="text-blue-600 font-semibold flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        <span>View on Map</span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}

              {schematicFloorRooms.length === 0 && (
                <div className="col-span-3 p-12 text-center text-stone-400">
                  <p className="text-sm">No special facilities cataloged on this floor level yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: CANTEEN MENUS & PRICE CATALOG */}
      {activeViewMode === 'menu' && (
        <div className="p-5 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-zinc-800">
            <div>
              <h3 className="font-serif text-xl font-bold">
                Acropolis Indore Campus Canteen Menu Catalog
              </h3>
              <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                Real student pricing for Baked Samosa, Poha Jalebi, sandwiches &amp; tea across Block A, B, and Manglia Gate
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Max Budget:</span>
              <input
                type="range"
                min="20"
                max="250"
                step="10"
                value={maxBudgetFilter}
                onChange={(e) => setMaxBudgetFilter(Number(e.target.value))}
                className="accent-[#7A1F1E] cursor-pointer"
              />
              <span className="font-serif font-bold text-sm text-[#7A1F1E] dark:text-rose-400">
                ₹{maxBudgetFilter}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrichedFoodSpots.map((spot) => (
              <div 
                key={spot.id}
                className={`p-5 rounded-3xl border transition-all ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-stone-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-rose-100 text-[#7A1F1E] dark:bg-rose-950 dark:text-rose-300">
                      {spot.categoryLabel}
                    </span>
                    <h4 className="font-serif font-bold text-base mt-1 text-stone-900 dark:text-white">
                      {spot.name}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-zinc-400">
                      {spot.locationDescription}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-600 font-serif">
                      ₹{spot.averagePrice}
                    </span>
                    <span className="text-[9px] text-stone-400 block">Avg/item</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
                  {spot.popularDishes.map((dish) => (
                    <div key={dish.id} className="flex items-center justify-between text-xs">
                      <span className="text-stone-700 dark:text-zinc-300">{dish.name}</span>
                      <span className="font-bold text-[#7A1F1E] dark:text-rose-400">₹{dish.price}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    handleSpotClick(spot);
                    setActiveViewMode('map');
                  }}
                  className="w-full py-2 rounded-xl bg-[#7A1F1E] hover:bg-[#5C1716] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Locate on Map (~{spot.dynamicWalkTimeMinutes}m)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
