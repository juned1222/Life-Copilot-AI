import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Compass, 
  UtensilsCrossed, 
  BookOpen, 
  Code, 
  FileText, 
  ChevronRight, 
  Sparkles, 
  HelpCircle,
  X,
  Map,
  DollarSign,
  Clock,
  ArrowRight,
  Info,
  Lock,
  LogOut,
  User,
  Calendar,
  Check,
  Plus,
  Settings,
  TrendingUp,
  Sliders,
  Trash2,
  Moon,
  Sun,
  Building
} from 'lucide-react';
import { SearchState, UserProfile } from '../types';
import CampusFoodMap from './CampusFoodMap';
import CampusNavigator from './CampusNavigator';

interface DashboardProps {
  rollNumber: string;
  userProfile?: UserProfile | null;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onSearchSubmit: (search: SearchState) => void;
  onLogout: () => void;
}

export default function Dashboard({ 
  rollNumber, 
  userProfile, 
  theme, 
  toggleTheme,
  onSearchSubmit, 
  onLogout 
}: DashboardProps) {
  
  // Tab Navigation: 'dashboard' | 'navigator' | 'planner' | 'food' | 'budget' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'navigator' | 'planner' | 'food' | 'budget' | 'settings'>('dashboard');
  const [foodViewMode, setFoodViewMode] = useState<'map' | 'catalog'>('map');
  
  // Mobile Sidebar Drawer
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Search Engine Bindings
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBudget, setSearchBudget] = useState<number>(150);
  const [searchTime, setSearchTime] = useState('Under 30m');

  // Interactive Task List State (feeds Card 1: Daily Overview Progress circle)
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Submit Physics Lab Unit 2 Report', completed: true, category: 'Academic' },
    { id: 2, text: 'Refactor CS-1 Binary Search loops', completed: false, category: 'Coding' },
    { id: 3, text: 'Collect Engineering Graphics sheets', completed: true, category: 'Stationery' },
    { id: 4, text: 'Audit bakesamosa inventory levels', completed: false, category: 'Food' },
    { id: 5, text: 'Prepare CS Section 1 group project deck', completed: false, category: 'Academic' }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Interactive Expense Manager State (feeds Card 2: Budget Tracker)
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Bakesamosa & Chai (Manasvi)', amount: 65, category: 'Food', date: 'Today' },
    { id: 2, name: 'A4 sheets & drafter (Stationery B)', amount: 150, category: 'Stationery', date: 'Today' },
    { id: 3, name: 'Poha Jalebi (Manglia Gate)', amount: 45, category: 'Food', date: 'Yesterday' }
  ]);
  const [expenseLimit, setExpenseLimit] = useState(1200);
  const [newExpName, setNewExpName] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpCat, setNewExpCat] = useState('Food');

  // Diagnostic Utility States (PDF digest & Code review simulations)
  const [pdfName, setPdfName] = useState('');
  const [pdfResult, setPdfResult] = useState<string | null>(null);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeResult, setCodeResult] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Formatted Date
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Calculations for Card 1 (Daily Overview circular progress)
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Circle coordinates
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Calculations for Card 2 (Remaining budget)
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = Math.max(0, expenseLimit - totalSpent);
  const budgetSpentPercent = Math.min(100, Math.round((totalSpent / expenseLimit) * 100));

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onSearchSubmit({
      itemQuery: searchQuery.trim(),
      maxBudget: searchBudget,
      maxTime: searchTime
    });
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTaskText.trim(), completed: false, category: 'Academic' }
    ]);
    setNewTaskText('');
  };

  // Toggle Task Completeness
  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Delete Task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Add Expense
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpName.trim() || !newExpAmount) return;
    setExpenses([
      ...expenses,
      { 
        id: Date.now(), 
        name: newExpName.trim(), 
        amount: Number(newExpAmount), 
        category: newExpCat, 
        date: 'Today' 
      }
    ]);
    setNewExpName('');
    setNewExpAmount('');
  };

  // Delete Expense
  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Trigger diagnostic quick items
  const handleQuickAction = (action: string) => {
    if (userProfile?.role === 'guest' && (action === 'code' || action === 'pdf')) {
      setActiveModal('guestRestricted');
      return;
    }
    switch (action) {
      case 'code':
        setActiveTab('planner');
        setTimeout(() => {
          const el = document.getElementById('code-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'pdf':
        setActiveTab('planner');
        setTimeout(() => {
          const el = document.getElementById('pdf-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'map':
        setActiveModal('campusMap');
        break;
      default:
        break;
    }
  };

  // Simulation handlers
  const handleSimulatePDF = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfName) return;
    setIsAnalyzing(true);
    setPdfResult("Synthesizing document parameters via Life Copilot AI...");
    setTimeout(() => {
      setPdfResult(`Success! Dissected "${pdfName}":\n\n- Key Target: Practical procedure checks for AITR First-Year lab files.\n- High-Yield Equation: Focus on error margin formula Page 18.\n- Action Plan: Double-check graphs in Block B graphics room before 3 PM.`);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleSimulateCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeSnippet) return;
    setIsAnalyzing(true);
    setCodeResult("Refactoring algorithm tracks...");
    setTimeout(() => {
      setCodeResult(`Copilot Recommendation:\n\n- Complexity: Reduced from O(N²) quadratic loops to O(N log N) using sorting.\n- Memory Tip: Prevent memory leaks inside Indore simulation test beds.\n- Optimization: Replace nested loops with a clean single-pass Set structure.`);
      setIsAnalyzing(false);
    }, 1000);
  };

  // Navigation Options
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'navigator', label: 'Room & Lab Navigator', icon: Building },
    { id: 'food', label: 'Food & Campus Map', icon: UtensilsCrossed },
    { id: 'planner', label: 'AI Study Planner', icon: BookOpen },
    { id: 'budget', label: 'Budget Tracker', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  return (
    <div className={`h-screen w-full flex p-4 gap-4 font-sans overflow-hidden select-none transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#080808] text-zinc-100' : 'bg-[#FDFBF7] text-[#2D2A26]'
    }`}>
      
      {/* LEFT SIDEBAR (Desktop Navigation) */}
      <aside className="w-64 bg-[#7A1F1E] rounded-[32px] p-6 flex flex-col justify-between text-[#FDFBF7] shrink-0 max-md:hidden shadow-lg border border-[#7A1F1E]/20 relative overflow-hidden">
        
        {/* Subtle geometric pattern in maroon sidebar */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl pointer-events-none -mr-4 -mt-4" />
        
        <div>
          {/* Brand/Logo Section */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-[#FDFBF7] text-[#7A1F1E] flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg tracking-tight block text-white">Life Copilot <span className="text-[#EAE2D8]">AI</span></span>
              <span className="text-[9px] font-mono tracking-widest text-[#EAE2D8]/60 uppercase block">AITR Companion</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-[#7A1F1E] shadow-md font-bold' 
                      : 'text-[#FDFBF7]/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#7A1F1E]' : 'text-current'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section with Call-out Card & Session Action */}
        <div className="space-y-4">
          
          {/* Lighter Maroon Premium Callout Card */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-8 h-8 bg-amber-400/20 rounded-full filter blur-md" />
            <h5 className="text-[10px] font-bold tracking-widest uppercase text-[#FDFBF7]">Copilot Premium</h5>
            <p className="text-[10px] text-[#EAE2D8] mt-1 leading-relaxed">
              Unlock offline model weights & secure continuous cloud logs
            </p>
            <button
              onClick={() => setActiveModal('premiumInfo')}
              className="mt-3 w-full py-2 bg-[#FDFBF7] text-[#7A1F1E] rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-[#EAE2D8] transition shadow-sm"
            >
              Learn More
            </button>
          </div>

          {/* Student Profile Info & Logout */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <div className="w-8 h-8 rounded-full bg-[#EAE2D8]/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-white leading-tight truncate">
                  {userProfile?.fullName || 'Guest Student'}
                </p>
                <p className="text-[9px] font-mono text-[#EAE2D8]/50 truncate uppercase tracking-wider">
                  {userProfile?.role === 'guest' ? 'Guest Pass' : rollNumber || 'Student'}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-[#FDFBF7]/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </aside>

      {/* MOBILE HEADER (Navigation & Logo for smaller screens) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-[#7A1F1E] p-6 text-white flex flex-col justify-between shadow-2xl z-50 rounded-r-[32px]"
            >
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="font-serif font-bold text-lg">Life Copilot</span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="p-1.5 rounded-full hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all ${
                          isActive 
                            ? 'bg-white text-[#7A1F1E] font-bold shadow-md' 
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-4">
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold truncate max-w-[120px]">{userProfile?.fullName || 'Guest'}</p>
                      <p className="text-[9px] opacity-50 font-mono tracking-widest uppercase">{userProfile?.role}</p>
                    </div>
                  </div>
                  <button onClick={onLogout} className="p-2 rounded-xl hover:bg-white/10 text-white">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        
        {/* TOP HEADER BAR */}
        <header className={`flex items-center justify-between gap-4 mb-5 pb-4 border-b shrink-0 ${
          theme === 'dark' ? 'border-zinc-800' : 'border-stone-200/60'
        }`}>
          
          <div className="flex items-center gap-3">
            {/* Hamburger button on Mobile */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-2xl border shadow-xs md:hidden ${
                theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-stone-200 text-[#2D2A26]'
              }`}
            >
              <Sliders className="w-5 h-5 rotate-90" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className={`font-serif text-2xl md:text-3xl font-light tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-[#2D2A26]'
                }`}>
                  Welcome back, <span className="font-semibold text-[#7A1F1E] dark:text-rose-400">{userProfile?.fullName?.split(' ')[0] || 'Student'}</span>
                </h1>
                {userProfile?.role === 'guest' ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[9px] font-mono tracking-wider font-extrabold uppercase">Guest</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#7A1F1E]/10 text-[#7A1F1E] dark:bg-rose-950/40 dark:text-rose-300 border border-[#7A1F1E]/20 text-[9px] font-mono tracking-wider font-bold uppercase">AITR Indore</span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7A1F1E] dark:text-rose-400" />
                <span>{getFormattedDate()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Unified Primary Search Console */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-sm w-full md:w-80 max-sm:hidden">
              <Search className="absolute left-4 w-4 h-4 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search food, Lab 116, block rooms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-4 py-2.5 text-xs rounded-full border transition-all shadow-xs outline-none ${
                  theme === 'dark' 
                    ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-rose-500' 
                    : 'bg-white border-stone-200 text-[#2D2A26] placeholder-stone-400 focus:border-[#7A1F1E]'
                }`}
              />
            </form>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              type="button"
              className={`p-2.5 rounded-2xl border transition shadow-xs cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:text-white hover:bg-zinc-800' 
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* PRIMARY SCROLLABLE TAB PANEL PORT */}
        <div className="flex-1 overflow-y-auto pr-1 pb-4">
          
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                
                {/* Secondary AI Status Indicator Banner */}
                <div className="bg-[#7A1F1E]/5 dark:bg-[#7A1F1E]/15 border border-[#7A1F1E]/10 dark:border-[#7A1F1E]/30 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#7A1F1E]/10 dark:bg-[#7A1F1E]/30 text-[#7A1F1E] dark:text-rose-400 rounded-xl shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2D2A26] dark:text-zinc-100 uppercase tracking-wider">AITR LifeCopilot Agent Active</p>
                      <p className="text-[11px] text-stone-500 dark:text-zinc-400 font-medium">Instantly matching canteens, stationery, Block B basements, and academic algorithms.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleQuickAction('map')}
                      className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-[#7A1F1E] dark:text-rose-300 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-zinc-700 transition shadow-xs cursor-pointer"
                    >
                      Map Layout
                    </button>
                    <button 
                      onClick={() => handleQuickAction('code')}
                      className="px-3 py-1.5 bg-[#7A1F1E] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-[#5C1716] transition shadow-xs cursor-pointer"
                    >
                      Refactor Code
                    </button>
                  </div>
                </div>

                {/* BENTO GRID DIAGNOSTICS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* CARD 1: DAILY OVERVIEW (Large - 2 Columns) */}
                  <div className="md:col-span-2 bg-white dark:bg-[#141417] rounded-3xl p-6 border border-stone-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#7A1F1E]/2 rounded-full filter blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-[#2D2A26] dark:text-zinc-100">Daily Overview</h3>
                        <p className="text-[11px] text-stone-400 dark:text-zinc-500 uppercase font-mono tracking-widest mt-0.5">Tasks &amp; Academic Progress</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#7A1F1E]/5 dark:bg-[#7A1F1E]/20 text-[#7A1F1E] dark:text-rose-400 border border-[#7A1F1E]/15 dark:border-[#7A1F1E]/30 text-[9px] font-mono font-bold tracking-wider uppercase">
                        Interactive
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      
                      {/* Left: Simulated SVG Circular Progress Ring */}
                      <div className="sm:col-span-4 flex flex-col items-center justify-center bg-[#FDFBF7]/40 dark:bg-zinc-900/60 rounded-2xl p-4 border border-stone-100 dark:border-zinc-800">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Track Circle */}
                            <circle 
                              cx="50" 
                              cy="50" 
                              r={radius} 
                              className="stroke-[#EAE2D8]/40 dark:stroke-zinc-800 fill-none" 
                              strokeWidth="8"
                            />
                            {/* Progress Circle with elegant Maroon overlay */}
                            <motion.circle 
                              cx="50" 
                              cy="50" 
                              r={radius} 
                              className="stroke-[#7A1F1E] fill-none" 
                              strokeWidth="8"
                              strokeLinecap="round"
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              strokeDasharray={circumference}
                            />
                          </svg>

                          {/* Central Percentage */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold font-serif text-[#2D2A26] dark:text-zinc-100">{progressPercentage}%</span>
                            <span className="text-[9px] text-stone-500 dark:text-zinc-400 font-mono tracking-wider uppercase">{completedTasks} / {totalTasks} Done</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-stone-500 dark:text-zinc-400 font-bold uppercase mt-2.5 tracking-wider">Overall Progress</p>
                      </div>

                      {/* Right: Quick Checkbox Item List */}
                      <div className="sm:col-span-8 space-y-2 max-h-52 overflow-y-auto pr-1">
                        {tasks.slice(0, 4).map((task) => (
                          <div 
                            key={task.id} 
                            onClick={() => toggleTask(task.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                              task.completed 
                                ? 'bg-[#7A1F1E]/5 dark:bg-[#7A1F1E]/15 border-[#7A1F1E]/10 dark:border-[#7A1F1E]/20 text-stone-500 dark:text-zinc-500' 
                                : 'bg-stone-50 dark:bg-zinc-900 border-stone-200/80 dark:border-zinc-800 hover:border-[#7A1F1E]/30 text-[#2D2A26] dark:text-zinc-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                                task.completed 
                                  ? 'bg-[#7A1F1E] border-[#7A1F1E] text-[#FDFBF7]' 
                                  : 'border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                              }`}>
                                {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className={`text-xs font-medium leading-snug ${task.completed ? 'line-through opacity-70' : ''}`}>
                                {task.text}
                              </span>
                            </div>
                            <span className="px-1.5 py-0.5 rounded-md bg-[#EAE2D8]/30 dark:bg-zinc-800 text-[#2D2A26] dark:text-zinc-300 text-[8px] font-mono uppercase tracking-wider font-semibold">
                              {task.category}
                            </span>
                          </div>
                        ))}
                        {tasks.length > 4 && (
                          <p onClick={() => setActiveTab('planner')} className="text-center text-[10px] font-bold text-[#7A1F1E] dark:text-rose-400 hover:underline cursor-pointer">
                            + View all {tasks.length} planner tasks
                          </p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* CARD 2: BUDGET TRACKER (Small - 1 Column) */}
                  <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 border border-stone-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#2D2A26] dark:text-zinc-100">Budget Tracker</h3>
                          <p className="text-[11px] text-stone-400 dark:text-zinc-500 uppercase font-mono tracking-widest mt-0.5">Allowance &amp; limits</p>
                        </div>
                        <div className="p-2 bg-stone-100 dark:bg-zinc-800 rounded-xl text-[#7A1F1E] dark:text-rose-400">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Main remaining balance */}
                      <div className="mt-4">
                        <span className="text-3xl font-bold font-serif text-[#7A1F1E] dark:text-rose-400">₹{remainingBudget}</span>
                        <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium ml-1.5">left of ₹{expenseLimit}</span>
                      </div>

                      {/* Simple Linear Progress Bar */}
                      <div className="mt-4">
                        <div className="w-full h-2.5 bg-[#EAE2D8]/40 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${budgetSpentPercent}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-[#7A1F1E] rounded-full"
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1.5 text-[10px] text-stone-500 dark:text-zinc-400 font-mono tracking-wider uppercase font-semibold">
                          <span>{budgetSpentPercent}% spent</span>
                          <span>Spent ₹{totalSpent}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active Card</span>
                      <button 
                        onClick={() => setActiveTab('budget')}
                        className="text-xs text-[#7A1F1E] dark:text-rose-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Manager</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* CARD 3: FOCUS INDEX (Small - 1 Column) */}
                  <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 border border-stone-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between group">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#2D2A26] dark:text-zinc-100">Focus Index</h3>
                          <p className="text-[11px] text-stone-400 dark:text-zinc-500 uppercase font-mono tracking-widest mt-0.5">Study Track Score</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[9px] font-mono font-bold uppercase tracking-wider">
                          High
                        </span>
                      </div>

                      <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="text-3.5xl font-bold font-serif text-[#2D2A26] dark:text-zinc-100">88%</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+4.2%</span>
                        </span>
                      </div>

                      {/* Mock mini scatter-plot / dotted pattern SVG */}
                      <div className="mt-4 bg-[#FDFBF7]/60 dark:bg-zinc-900/60 border border-stone-100 dark:border-zinc-800 rounded-2xl p-2.5 h-20 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 160 50">
                          {/* Grid lines */}
                          <line x1="0" y1="10" x2="160" y2="10" stroke="#EAE2D8" strokeWidth="0.5" strokeDasharray="2 2" />
                          <line x1="0" y1="25" x2="160" y2="25" stroke="#EAE2D8" strokeWidth="0.5" strokeDasharray="2 2" />
                          <line x1="0" y1="40" x2="160" y2="40" stroke="#EAE2D8" strokeWidth="0.5" strokeDasharray="2 2" />
                          
                          {/* Dotted path (representing focus spikes over 7 study cycles) */}
                          <circle cx="15" cy="42" r="3" fill="#7A1F1E" opacity="0.3" />
                          <circle cx="35" cy="35" r="4.5" fill="#7A1F1E" opacity="0.5" />
                          <circle cx="55" cy="18" r="4" fill="#7A1F1E" opacity="0.8" />
                          <circle cx="75" cy="22" r="3" fill="#7A1F1E" opacity="0.4" />
                          <circle cx="95" cy="12" r="5" fill="#7A1F1E" opacity="0.9" />
                          <circle cx="115" cy="28" r="4" fill="#7A1F1E" opacity="0.6" />
                          <circle cx="135" cy="15" r="5" fill="#7A1F1E" />
                          <circle cx="150" cy="20" r="3" fill="#7A1F1E" opacity="0.7" />

                          {/* Smooth guide wave line overlay */}
                          <path 
                            d="M 15 42 Q 35 30 55 18 T 95 12 T 135 15" 
                            fill="none" 
                            stroke="#7A1F1E" 
                            strokeWidth="1.5" 
                            strokeDasharray="1 3"
                            opacity="0.8"
                          />
                        </svg>
                      </div>
                    </div>

                    <p className="text-[9px] text-stone-400 dark:text-zinc-500 font-mono tracking-wider uppercase mt-4 leading-tight">
                      Dotted scatter graph calculates continuous engagement indices
                    </p>
                  </div>

                  {/* CARD 4: WEEKLY AI USAGE / STUDY ANALYTICS (Wide - 3 Columns) */}
                  <div className="md:col-span-3 bg-white dark:bg-[#141417] rounded-3xl p-6 border border-stone-200/60 dark:border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#EAE2D8]/10 rounded-full filter blur-2xl pointer-events-none" />
                    
                    <div>
                      <div className="flex items-start justify-between mb-6 pb-2 border-b border-stone-100 dark:border-zinc-800">
                        <div>
                          <h3 className="font-serif text-lg font-bold text-[#2D2A26] dark:text-zinc-100">Weekly AI Usage / Study Analytics</h3>
                          <p className="text-[11px] text-stone-400 dark:text-zinc-500 uppercase font-mono tracking-widest mt-0.5">Study hours &amp; Copilot response ticks across days of week</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#7A1F1E] dark:text-rose-400 font-mono tracking-wider uppercase bg-[#7A1F1E]/5 dark:bg-[#7A1F1E]/20 px-2.5 py-1 rounded-md border border-[#7A1F1E]/15 dark:border-[#7A1F1E]/30">
                          Peak Focus: Thursday
                        </span>
                      </div>

                      {/* Simulated Bar Chart Layout with varying heights */}
                      <div className="grid grid-cols-7 gap-4 md:gap-8 items-end h-36 px-2 mt-2">
                        
                        {/* Monday */}
                        <div className="flex flex-col items-center gap-2 h-full justify-end group/bar cursor-pointer">
                          <div className="relative w-full">
                            {/* Hover tooltip */}
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-[#2D2A26] text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition duration-200 font-mono pointer-events-none mb-1 shadow-md">
                              3.2h
                            </span>
                            <div className="w-full bg-stone-200 hover:bg-stone-300 rounded-t-lg transition-all" style={{ height: '40px' }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">Mon</span>
                        </div>

                        {/* Tuesday */}
                        <div className="flex flex-col items-center gap-2 h-full justify-end group/bar cursor-pointer">
                          <div className="relative w-full">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-[#2D2A26] text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition duration-200 font-mono pointer-events-none mb-1 shadow-md">
                              4.8h
                            </span>
                            <div className="w-full bg-stone-200 hover:bg-stone-300 rounded-t-lg transition-all" style={{ height: '65px' }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">Tue</span>
                        </div>

                        {/* Wednesday */}
                        <div className="flex flex-col items-center gap-2 h-full justify-end group/bar cursor-pointer">
                          <div className="relative w-full">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-[#2D2A26] text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition duration-200 font-mono pointer-events-none mb-1 shadow-md">
                              5.5h
                            </span>
                            <div className="w-full bg-stone-200 hover:bg-stone-300 rounded-t-lg transition-all" style={{ height: '80px' }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">Wed</span>
                        </div>

                        {/* Thursday - Peak Active Maroon Bar */}
                        <div className="flex flex-col items-center gap-2 h-full justify-end group/bar cursor-pointer">
                          <div className="relative w-full">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-[#7A1F1E] text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-100 transition duration-200 font-mono pointer-events-none mb-1 shadow-md font-bold">
                              6.5h
                            </span>
                            <div className="w-full bg-[#7A1F1E] hover:bg-[#5C1716] rounded-t-lg transition-all shadow-md" style={{ height: '110px' }} />
                          </div>
                          <span className="text-[10px] font-mono font-black tracking-widest text-[#7A1F1E] uppercase">Thu</span>
                        </div>

                        {/* Friday */}
                        <div className="flex flex-col items-center gap-2 h-full justify-end group/bar cursor-pointer">
                          <div className="relative w-full">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-[#2D2A26] text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition duration-200 font-mono pointer-events-none mb-1 shadow-md">
                              4.0h
                            </span>
                            <div className="w-full bg-stone-200 hover:bg-stone-300 rounded-t-lg transition-all" style={{ height: '55px' }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">Fri</span>
                        </div>

                        {/* Saturday */}
                        <div className="flex flex-col items-center gap-2 h-full justify-end group/bar cursor-pointer">
                          <div className="relative w-full">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-[#2D2A26] text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition duration-200 font-mono pointer-events-none mb-1 shadow-md">
                              2.1h
                            </span>
                            <div className="w-full bg-stone-200 hover:bg-stone-300 rounded-t-lg transition-all" style={{ height: '30px' }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">Sat</span>
                        </div>

                        {/* Sunday */}
                        <div className="flex flex-col items-center gap-2 h-full justify-end group/bar cursor-pointer">
                          <div className="relative w-full">
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-[#2D2A26] text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover/bar:opacity-100 transition duration-200 font-mono pointer-events-none mb-1 shadow-md">
                              1.5h
                            </span>
                            <div className="w-full bg-stone-200 hover:bg-stone-300 rounded-t-lg transition-all" style={{ height: '20px' }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-500 uppercase">Sun</span>
                        </div>

                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                      <p className="flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-[#7A1F1E]" />
                        <span>Workloads are cross-referenced directly from CS Section 1 syllabus modules.</span>
                      </p>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Indore Coder Node v1.2</span>
                    </div>

                  </div>

                  {/* CARD 5: ACROPOLIS LIVE CAMPUS FOOD MAP QUICK WIDGET (Wide - 3 Columns) */}
                  <div className="md:col-span-3 bg-gradient-to-r from-[#7A1F1E] via-[#8E2423] to-[#B91C1C] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="space-y-1.5 z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-white/20">
                          Google Maps Grounded
                        </span>
                        <span className="text-amber-300 text-xs font-bold flex items-center gap-1">
                          ★ 8 Campus Canteens &amp; Manglia Tapris
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold">Acropolis Indore Live Food &amp; Canteen Map</h3>
                      <p className="text-xs text-[#EAE2D8] max-w-xl leading-relaxed">
                        Locate Block A Baked Samosa, Nescafe Cold Coffee, Gate 2 Food Court Dosas, and Manglia Bypass Tapri Poha with interactive walking ETAs and live price tags.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('food');
                        setFoodViewMode('map');
                      }}
                      className="z-10 px-5 py-3 rounded-2xl bg-white text-[#7A1F1E] font-bold text-xs uppercase tracking-wider hover:bg-[#EAE2D8] transition shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Open Interactive Map</span>
                    </button>
                  </div>

                  {/* CARD 6: ACROPOLIS ROOM & LAB NAVIGATOR QUICK WIDGET (Wide - 3 Columns) */}
                  <div className="md:col-span-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="space-y-1.5 z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-400/20">
                          3 Blocks • 3 Floors Matrix
                        </span>
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                          ✓ Lab 116, CV Raman Lab &amp; Turing Lab
                        </span>
                      </div>
                      <h3 className="font-serif text-xl font-bold">Acropolis Campus Room &amp; Lab Navigator</h3>
                      <p className="text-xs text-blue-100 max-w-xl leading-relaxed">
                        Never get lost finding classes! Ground floor (0x), 1st floor (10x), and 2nd floor (20x) rooms with step-by-step corridor wayfinding and architectural 2D schematics.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('navigator')}
                      className="z-10 px-5 py-3 rounded-2xl bg-white text-blue-950 font-bold text-xs uppercase tracking-wider hover:bg-blue-50 transition shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
                    >
                      <Building className="w-4 h-4 text-blue-700" />
                      <span>Explore Room Navigator</span>
                    </button>
                  </div>

                </div>

              </motion.div>
            )}

            {activeTab === 'navigator' && (
              <motion.div
                key="navigator-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <CampusNavigator 
                  theme={theme} 
                  onBackToDashboard={() => setActiveTab('dashboard')}
                />
              </motion.div>
            )}

            {activeTab === 'food' && (
              <motion.div
                key="food-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <CampusFoodMap 
                  theme={theme}
                  onBackToDashboard={() => setActiveTab('dashboard')}
                  onSelectDishForSearch={(dishName, maxBudget) => {
                    setSearchQuery(dishName);
                    setSearchBudget(maxBudget);
                    onSearchSubmit({
                      itemQuery: dishName,
                      maxBudget: maxBudget,
                      maxTime: 'Under 30m'
                    });
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'planner' && (
              <motion.div
                key="planner-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header with Return to Dashboard */}
                <div className="flex items-center justify-between pb-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-[#7A1F1E] text-white hover:bg-[#5C1716] shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    <span>← Return to Dashboard</span>
                  </button>
                  <span className="text-xs font-mono text-stone-400">AITR Academic Planner</span>
                </div>

                {/* AI Study Planner Page Wrapper */}
                <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 border border-stone-200/60 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-zinc-800 mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-light text-[#2D2A26] dark:text-zinc-100">AI Study Planner</h2>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">Design daily tasks, schedule lecture review modules, and run diagnostics</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-[#7A1F1E] dark:text-rose-400 opacity-80" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Panel: Task Planner Entry */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A1F1E] dark:text-rose-400">Add Study Task</h4>
                      <form onSubmit={handleAddTask} className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={newTaskText}
                          onChange={(e) => setNewTaskText(e.target.value)}
                          placeholder="e.g. Submit chemical lab file Unit 3..."
                          className="flex-1 px-4 py-2.5 text-xs bg-[#FDFBF7] dark:bg-zinc-900 text-[#2D2A26] dark:text-zinc-100 placeholder-stone-400 border border-stone-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-[#7A1F1E]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-[#7A1F1E] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#5C1716] transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </form>

                      {/* Planner Task List */}
                      <div className="space-y-2 mt-4 max-h-80 overflow-y-auto">
                        {tasks.map((task) => (
                          <div 
                            key={task.id}
                            className="p-3.5 bg-[#FDFBF7] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => toggleTask(task.id)}
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                  task.completed 
                                    ? 'bg-[#7A1F1E] border-[#7A1F1E] text-white' 
                                    : 'border-stone-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-[#7A1F1E]'
                                }`}
                              >
                                {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </button>
                              <span className={`text-xs font-medium leading-relaxed ${task.completed ? 'line-through text-stone-400 dark:text-zinc-500' : 'text-[#2D2A26] dark:text-zinc-100'}`}>
                                {task.text}
                              </span>
                            </div>

                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Panel: Information */}
                    <div className="bg-[#FDFBF7] dark:bg-zinc-900/60 p-5 rounded-2xl border border-stone-200/80 dark:border-zinc-800 space-y-4">
                      <div className="flex items-center gap-2 text-[#7A1F1E] dark:text-rose-400">
                        <Sparkles className="w-5 h-5" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">AITR Indore Lecture Schedule Sync</h4>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-zinc-300 leading-relaxed font-medium">
                        Your study tracks are synchronizing from the Indore Central Server block files. LifeCopilot is monitoring:
                      </p>
                      <ul className="space-y-2 text-xs text-stone-500 dark:text-zinc-400 font-medium list-disc pl-4">
                        <li><strong>CS-1 &amp; CS-2:</strong> Advanced pointers, data structures recursion logic, and memory layout.</li>
                        <li><strong>Graphics Lab (Block B):</strong> Drafter alignment parameters, scale parameters, isometric elevations.</li>
                        <li><strong>Physics Lab (Block B Basement):</strong> Optical interference indices and spectrometer parameters.</li>
                      </ul>
                      <div className="p-3 bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl flex items-start gap-2.5">
                        <Info className="w-4.5 h-4.5 text-[#7A1F1E] dark:text-rose-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400">Completing tasks in this panel directly drives the <strong>Daily Overview</strong> gauge on your primary Dashboard.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DIAGNOSTIC SECTION 1: CODE GUARD */}
                <div id="code-section" className="bg-white dark:bg-[#141417] rounded-3xl p-6 border border-stone-200/60 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 rounded-xl text-[#7A1F1E] dark:text-rose-300">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#2D2A26] dark:text-zinc-100">Code Guard Audit Engine</h3>
                      <p className="text-xs text-stone-400 dark:text-zinc-500">Review time-space complexity and fix recursion mistakes</p>
                    </div>
                  </div>

                  <form onSubmit={handleSimulateCode} className="space-y-4">
                    <div>
                      <label htmlFor="code-snippet-box" className="block text-[10px] font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-widest mb-1.5">Paste slow or unoptimized code block</label>
                      <textarea
                        id="code-snippet-box"
                        rows={4}
                        required
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        placeholder={`for (let i = 0; i < arr.length; i++) {\n  for (let j = 0; j < arr.length; j++) {\n    if (arr[i] === arr[j]) return true;\n  }\n}`}
                        className="w-full p-4 bg-[#FDFBF7] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-2xl text-xs font-mono text-[#2D2A26] dark:text-zinc-100 outline-none focus:border-[#7A1F1E] transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isAnalyzing}
                      className="px-5 py-2.5 bg-[#7A1F1E] hover:bg-[#5C1716] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer"
                    >
                      {isAnalyzing ? "Auditing Code Engine..." : "Audit Code Algorithm"}
                    </button>
                  </form>

                  <AnimatePresence>
                    {codeResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-[#FDFBF7] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-2xl text-xs font-mono text-[#2D2A26] dark:text-zinc-200 whitespace-pre-wrap leading-relaxed shadow-inner"
                      >
                        {codeResult}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {activeTab === 'budget' && (
              <motion.div
                key="budget-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header with Return to Dashboard */}
                <div className="flex items-center justify-between pb-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-[#7A1F1E] text-white hover:bg-[#5C1716] shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    <span>← Return to Dashboard</span>
                  </button>
                  <span className="text-xs font-mono text-stone-400">AITR Student Budget Tracker</span>
                </div>

                {/* Budget Tracker Page */}
                <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 border border-stone-200/60 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-zinc-800 mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-light text-[#2D2A26] dark:text-zinc-100">Budget &amp; Allowance Manager</h2>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">Control your daily campus pocket expenditures interactively</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-[#7A1F1E] dark:text-rose-400" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left stats column */}
                    <div className="p-5 bg-[#FDFBF7] dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 space-y-4">
                      <span className="text-[10px] font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-widest">Spending Capacity</span>
                      <div className="space-y-1">
                        <p className="text-3xl font-serif font-bold text-[#7A1F1E] dark:text-rose-400">₹{remainingBudget}</p>
                        <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium">Remaining of ₹{expenseLimit} Allowance</p>
                      </div>

                      <div className="pt-4 border-t border-stone-200 dark:border-zinc-800 space-y-3">
                        <div>
                          <label htmlFor="limit-edit-input" className="block text-[10px] font-bold text-stone-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Set Total Allowance Limit</label>
                          <input
                            id="limit-edit-input"
                            type="number"
                            value={expenseLimit}
                            onChange={(e) => setExpenseLimit(Number(e.target.value))}
                            className="w-full px-3 py-2 text-xs bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-[#2D2A26] dark:text-zinc-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Middle list column */}
                    <div className="md:col-span-2 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#7A1F1E] dark:text-rose-400">Expenditure History</h3>
                      
                      {/* Log Entry Form */}
                      <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          required
                          value={newExpName}
                          onChange={(e) => setNewExpName(e.target.value)}
                          placeholder="Item name..."
                          className="sm:col-span-2 px-3 py-2 text-xs bg-[#FDFBF7] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-xl text-[#2D2A26] dark:text-zinc-100"
                        />
                        <input
                          type="number"
                          required
                          value={newExpAmount}
                          onChange={(e) => setNewExpAmount(e.target.value)}
                          placeholder="Amount ₹..."
                          className="px-3 py-2 text-xs bg-[#FDFBF7] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-700 rounded-xl text-[#2D2A26] dark:text-zinc-100"
                        />
                        <button
                          type="submit"
                          className="py-2 bg-[#7A1F1E] hover:bg-[#5C1716] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                        >
                          Add Log
                        </button>
                      </form>

                      {/* Expense Item List */}
                      <div className="space-y-2 max-h-64 overflow-y-auto mt-4">
                        {expenses.map((exp) => (
                          <div 
                            key={exp.id}
                            className="p-3 bg-[#FDFBF7] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between gap-3"
                          >
                            <div>
                              <p className="text-xs font-bold text-[#2D2A26] dark:text-zinc-100">{exp.name}</p>
                              <span className="text-[9px] font-mono uppercase tracking-wider text-stone-400 dark:text-zinc-500 font-semibold">{exp.category} · {exp.date}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-[#7A1F1E] dark:text-rose-400">₹{exp.amount}</span>
                              <button 
                                onClick={() => deleteExpense(exp.id)}
                                className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header with Return to Dashboard */}
                <div className="flex items-center justify-between pb-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-[#7A1F1E] text-white hover:bg-[#5C1716] shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    <span>← Return to Dashboard</span>
                  </button>
                  <span className="text-xs font-mono text-stone-400">AITR System Settings</span>
                </div>

                {/* Settings & Profile Page */}
                <div className="bg-white dark:bg-[#141417] rounded-3xl p-6 border border-stone-200/60 dark:border-zinc-800 shadow-sm">
                  <div className="flex items-start justify-between pb-4 border-b border-stone-100 dark:border-zinc-800 mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-light text-[#2D2A26] dark:text-zinc-100">System Settings</h2>
                      <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">Manage Cadet credentials, theme palettes, and node statuses</p>
                    </div>
                    <Settings className="w-8 h-8 text-[#7A1F1E] dark:text-rose-400" />
                  </div>

                  <div className="space-y-6">
                    
                    {/* Theme Mode Option */}
                    <div className="p-4 bg-[#FDFBF7] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#2D2A26] dark:text-zinc-100 uppercase tracking-wider">Toggle Display Mode</h4>
                        <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5">Toggle display parameters (Current: {theme === 'dark' ? 'Dark' : 'Light'})</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="px-4 py-2 bg-[#7A1F1E] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 shadow-sm hover:bg-[#5C1716] cursor-pointer"
                      >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span>Toggle Theme</span>
                      </button>
                    </div>

                    {/* Registry profile specs */}
                    <div className="p-5 bg-[#FDFBF7] dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl space-y-4">
                      <h4 className="text-xs font-bold text-[#2D2A26] dark:text-zinc-100 uppercase tracking-wider pb-1.5 border-b border-stone-200 dark:border-zinc-800">Registered Cadet Credentials</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Full Registered Name</span>
                          <p className="text-[#2D2A26] dark:text-zinc-100 font-bold">{userProfile?.fullName || 'Guest Student'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Enrollment Number / Roll</span>
                          <p className="text-[#2D2A26] dark:text-zinc-100 font-mono">{rollNumber || 'GUEST-MOCK-ENTRY'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Acropolis Email ID</span>
                          <p className="text-[#2D2A26] dark:text-zinc-100">{userProfile?.email || 'unverified@acropolis.in'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">Class Track</span>
                          <p className="text-[#2D2A26] dark:text-zinc-100">{userProfile?.classSection || 'Computer Science Section 1 (CS-1)'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Operational system nodes status */}
                    <div className="p-5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3">
                      <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Node Telemetry</h4>
                      <div className="flex flex-wrap gap-4 text-[10px] font-mono font-bold tracking-wider text-stone-500">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>CAMPUS OS NODE: SECURE</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>INDORE ENGINE SERVER: ONLINE</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#7A1F1E]" />
                          <span>THEME PALETTE: WARM EDITORIAL</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* HUD Desk Footer */}
        <footer className="text-center text-[10px] text-stone-400 font-sans tracking-wide py-2 border-t border-stone-200/60 shrink-0 flex items-center justify-between max-sm:flex-col gap-2">
          <p>Acropolis Institute of Technology and Research, Indore.</p>
          <p className="uppercase tracking-widest text-[8px] font-semibold text-[#7A1F1E]">
            SECURE CAMPUS OPERATION AND DIGITAL COMPANION NODE
          </p>
        </footer>

      </main>

      {/* MODAL LIGHT OVERLAYS */}
      <AnimatePresence>
        {activeModal !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-[28px] p-8 shadow-2xl border border-stone-200/80 text-[#2D2A26]"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full border border-stone-200 text-stone-400 hover:text-black hover:bg-stone-50 transition"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal 1: Campus Navigation */}
              {activeModal === 'campusMap' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-[#7A1F1E]/10 text-[#7A1F1E]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#2D2A26]">AITR Indore Campus layout</h4>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Official Block Layout &amp; Local Hotspots</p>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    <div className="p-4 rounded-2xl border border-stone-200/80 bg-[#FDFBF7]/60">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#7A1F1E]">Block A (Administrative &amp; IT)</h5>
                      <p className="text-xs mt-1 text-stone-600 leading-relaxed font-medium">
                        Houses CS &amp; IT lecture classrooms. Ground floor holds <strong>Acropolis College Canteen (Manasvi Foods)</strong>, known as the prime student hub for hot bakesamosa.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-stone-200/80 bg-[#FDFBF7]/60">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#7A1F1E]">Block B (Engineering Graphics &amp; Lab Basement)</h5>
                      <p className="text-xs mt-1 text-stone-600 leading-relaxed font-medium">
                        First-year lecture rooms. Basement holds the <strong>College Stationery Shop</strong> for immediate lab notebooks, drafters, and chart papers. The central porch holds <strong>Campus B Cafe</strong>.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-stone-200/80 bg-[#FDFBF7]/60">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#7A1F1E]">Block C (Library, Audis &amp; Placement cell)</h5>
                      <p className="text-xs mt-1 text-stone-600 leading-relaxed font-medium">
                        Ground floor holds registrar desks, admin offices, and academic records. Upper level contains quiet study zones and engineering research collections.
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl border border-stone-200/80 bg-[#FDFBF7]/60">
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#7A1F1E]">Manglia Square (1.2 KM Outlet)</h5>
                      <p className="text-xs mt-1 text-stone-600 leading-relaxed font-medium">
                        About 15 mins walk outside the campus gate. Contains cheap xerox shops, regional Indori poha-jalebi tapris, and local general merchants.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="mt-6 w-full py-3 bg-[#7A1F1E] hover:bg-[#5C1716] text-[#FDFBF7] rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    Dismiss layout
                  </button>
                </div>
              )}

              {/* Modal 2: Premium Callout Info */}
              {activeModal === 'premiumInfo' && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 bg-[#7A1F1E]/10 rounded-2xl flex items-center justify-center text-[#7A1F1E] mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#2D2A26]">Life Copilot AI Pro</h4>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                    Upgrading unlocks native server-side Gemini weights, allowing full document reasoning and instant offline diagnostics.
                  </p>
                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FDFBF7]/60 text-left text-xs font-medium text-stone-500">
                    Pro plans are fully covered by AITR Digital Campus scholarships. Consult the registry in Block C to map your voucher keys.
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-3 bg-[#7A1F1E] hover:bg-[#5C1716] text-[#FDFBF7] rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    Close Dialogue
                  </button>
                </div>
              )}

              {/* Modal 3: Guest Pass Warning */}
              {activeModal === 'guestRestricted' && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-12 h-12 bg-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-800 mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-amber-700">Student Clearance Required</h4>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                    Guests do not have unauthorized clearance for raw code audits or PDF syllabus compilation.
                  </p>
                  <div className="p-4 rounded-xl border border-stone-200 bg-[#FDFBF7]/60 text-left text-xs font-medium text-stone-500">
                    Disconnect this session and create a Student profile with your official <strong>@acropolis.in</strong> credentials.
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2.5 border border-stone-200 rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        onLogout();
                      }}
                      className="flex-1 py-2.5 bg-[#7A1F1E] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                    >
                      Logout Profile
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
