import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Lock, LogOut, User, X, ShieldAlert } from 'lucide-react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import { SearchState, SavedChat } from './types';
import { useAuth } from './context/AuthContext';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentScreen, setCurrentScreen] = useState<'auth' | 'dashboard' | 'chat'>('auth');
  const [currentSearch, setCurrentSearch] = useState<SearchState | null>(null);
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Use the genuine Firebase auth context
  const { userProfile, logout: authLogout } = useAuth();

  // Determine rollNumber for downstream components
  const rollNumber = userProfile?.role === 'guest' ? 'GUEST' : (userProfile?.rollNumber || null);

  // Toggle Dark/Light Mode
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Sync auth state with current screen routing
  useEffect(() => {
    if (userProfile) {
      if (currentScreen === 'auth') {
        setCurrentScreen('dashboard');
      }
    } else {
      setCurrentScreen('auth');
    }
  }, [userProfile]);

  // Load configuration and data on initialization
  useEffect(() => {
    // Dark mode by default
    document.documentElement.classList.add('dark');

    // Load saved diagnostics sessions
    const savedSessions = localStorage.getItem('aitr_saved_chats');
    if (savedSessions) {
      try {
        setSavedChats(JSON.parse(savedSessions));
      } catch (err) {
        console.error("Unable to parse historical chats:", err);
      }
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('aitr_saved_chats');
    setSavedChats([]);
    setCurrentSearch(null);
    await authLogout();
  };

  const handleSearchSubmit = (search: SearchState) => {
    setCurrentSearch(search);
    setCurrentScreen('chat');
  };

  const handleSaveChats = (updatedChats: SavedChat[]) => {
    setSavedChats(updatedChats);
    localStorage.setItem('aitr_saved_chats', JSON.stringify(updatedChats));
  };

  const handleBackToSearch = () => {
    setCurrentSearch(null);
    setCurrentScreen('dashboard');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 selection:bg-purple-500/30 selection:text-purple-300 ${
      theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      
      {/* Absolute top grid backgrounds for dashboard/chat pages */}
      {currentScreen === 'chat' && (
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-purple-600/5 to-transparent pointer-events-none" />
      )}

      {/* Dynamic Shell Navigation Bar */}
      {currentScreen === 'chat' && (
        <nav className={`relative z-20 border-b backdrop-blur-md transition-all duration-300 ${
          theme === 'dark' ? 'border-zinc-900 bg-[#050505]/75' : 'border-gray-200/80 bg-white/75'
        }`}>
          <div className="max-w-6xl w-full mx-auto px-6 h-16 flex items-center justify-between">
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToSearch}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <span className="text-sm font-black italic text-white leading-none">L</span>
              </div>
              <div>
                <span className={`font-display font-black text-sm tracking-tighter uppercase transition-colors ${
                  theme === 'dark' ? 'text-white hover:text-purple-400' : 'text-zinc-900 hover:text-purple-600'
                }`}>
                  LIFE COPILOT <span className="text-purple-500">AI</span>
                </span>
                <span className={`text-[9px] block font-mono tracking-widest uppercase ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>AITR Indore</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Prominent Return to Dashboard button */}
              <button
                onClick={handleBackToSearch}
                type="button"
                className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all bg-[#7A1F1E] text-white hover:bg-[#5C1716] shadow-sm"
              >
                <span>← Return to Dashboard</span>
              </button>

              {/* Personal Info Button */}
              <button
                onClick={() => setShowPersonalInfo(true)}
                type="button"
                className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                  theme === 'dark' 
                    ? 'border-zinc-850 bg-zinc-900/60 text-purple-400 hover:text-white hover:border-purple-500/35' 
                    : 'border-gray-200 bg-white text-purple-600 hover:bg-purple-50 hover:shadow-xs'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Personal Info</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                type="button"
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-white' 
                    : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 shadow-xs'
                }`}
                aria-label="Toggle layout theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Signout Button */}
              <button
                onClick={handleLogout}
                type="button"
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:text-rose-400 hover:border-rose-500/20'
                    : 'border-gray-200 bg-white text-gray-500 hover:text-rose-600 hover:shadow-xs'
                }`}
                title="Disconnect Cadet Credentials"
                aria-label="Disconnect Credentials"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </nav>
      )}

      {/* Screen Router Viewports */}
      <div className={`flex-1 flex flex-col ${currentScreen === 'chat' ? 'py-10 px-6 max-md:py-6 max-md:px-4' : ''}`}>
        <AnimatePresence mode="wait">
          {currentScreen === 'auth' && (
            <motion.div
              key="auth-view"
              className="flex-1 flex flex-col justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <AuthPage 
                theme={theme} 
                toggleTheme={toggleTheme} 
              />
            </motion.div>
          )}

          {currentScreen === 'dashboard' && rollNumber && (
            <motion.div
              key="dashboard-view"
              className="flex-1 h-screen w-full overflow-hidden"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <Dashboard 
                rollNumber={rollNumber} 
                userProfile={userProfile}
                theme={theme} 
                toggleTheme={toggleTheme}
                onSearchSubmit={handleSearchSubmit}
                onLogout={handleLogout}
              />
            </motion.div>
          )}

          {currentScreen === 'chat' && rollNumber && (
            <motion.div
              key="chat-view"
              className="flex-1 flex flex-col"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <ChatInterface
                initialSearch={currentSearch}
                savedChats={savedChats}
                onSaveChats={handleSaveChats}
                onBackToSearch={handleBackToSearch}
                theme={theme}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Personal Info Modal Overlay */}
      <AnimatePresence>
        {showPersonalInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPersonalInfo(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.35 }}
              className={`relative w-full max-w-md rounded-[28px] p-6 border transition-all duration-300 z-10 ${
                theme === 'dark' 
                  ? 'bg-zinc-900 border-zinc-800 text-white shadow-[0_0_50px_rgba(168,85,247,0.2)]' 
                  : 'bg-white border-gray-150 text-gray-900 shadow-2xl shadow-gray-300/60'
              }`}
            >
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-zinc-800/20">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  <h3 className="font-display font-black uppercase text-base tracking-tight">Personal Info Card</h3>
                </div>
                <button
                  onClick={() => setShowPersonalInfo(false)}
                  className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-white' 
                      : 'border-gray-150 bg-gray-50 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {userProfile?.role === 'guest' ? (
                /* Guest info screen */
                <div className="space-y-4 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-500">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono tracking-widest bg-amber-500/15 text-amber-500 font-bold">
                      GUEST PASS ACTIVE
                    </span>
                    <h4 className="font-display font-black text-xl uppercase tracking-tighter mt-2 text-amber-500">
                      Guest Visitor
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed max-w-xs mx-auto ${theme === 'dark' ? 'text-zinc-400' : 'text-neutral-500'}`}>
                    You are exploring as a guest. All student databases and advanced summarizer files are locked. Create or log into an authorized account.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowPersonalInfo(false);
                        handleLogout();
                      }}
                      className="w-full py-3 rounded-xl font-display font-black text-xs uppercase tracking-wider transition bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-95"
                    >
                      Sign Up / Login Student
                    </button>
                  </div>
                </div>
              ) : (
                /* Student info screen */
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-2xl border bg-black/25 border-zinc-800/50">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center text-white text-xl font-black italic shadow-md shrink-0">
                      {userProfile?.fullName ? userProfile.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase() : 'ST'}
                    </div>
                    <div className="truncate">
                      <h4 className="font-display font-black text-lg uppercase tracking-tight text-white truncate">
                        {userProfile?.fullName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-mono tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                        Cadet Officer
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className={`p-3 rounded-xl border flex justify-between items-center ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-850' : 'bg-gray-50 border-gray-150'}`}>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Enrollment Number:</span>
                      <span className="font-mono text-purple-400 font-extrabold">{userProfile?.rollNumber}</span>
                    </div>
                    <div className={`p-3 rounded-xl border flex justify-between items-center ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-850' : 'bg-gray-50 border-gray-150'}`}>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">College Email ID:</span>
                      <span className="font-mono text-zinc-300 font-medium truncate max-w-[180px]">{userProfile?.email}</span>
                    </div>
                    <div className={`p-3 rounded-xl border flex justify-between items-center ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-850' : 'bg-gray-50 border-gray-150'}`}>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Class & Section:</span>
                      <span className="font-mono text-zinc-300 font-bold">{userProfile?.classSection}</span>
                    </div>
                    <div className={`p-3 rounded-xl border flex justify-between items-center ${theme === 'dark' ? 'bg-zinc-950/40 border-zinc-850' : 'bg-gray-50 border-gray-150'}`}>
                      <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">Clearance Level:</span>
                      <span className="font-mono text-emerald-400 font-bold">UNRESTRICTED ACCESS</span>
                    </div>
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
