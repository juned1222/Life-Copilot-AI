import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  AlertCircle, 
  User, 
  Mail, 
  Lock, 
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

function getFirebaseFriendlyError(err: any): string {
  if (!err) return "An unexpected error occurred.";
  
  const code = (err.code || "").toLowerCase();
  const message = (err.message || "").toLowerCase();

  if (code === 'auth/email-already-in-use' || message.includes('email-already-in-use')) {
    return "This college Email ID is already registered. Please sign in instead.";
  }

  if (code === 'auth/weak-password' || message.includes('weak-password')) {
    return "The password is too weak. Please use a minimum of 6 characters.";
  }

  if (code === 'auth/invalid-email' || message.includes('invalid-email')) {
    return "Invalid Email ID format. Please use a valid email address.";
  }

  if (
    code === 'auth/invalid-credential' || 
    code === 'auth/wrong-password' || 
    code === 'auth/user-not-found' || 
    message.includes('invalid-credential') || 
    message.includes('wrong-password') || 
    message.includes('user-not-found') ||
    message.includes('invalid-login-credentials')
  ) {
    return "Incorrect Password. Please check your credentials and try again.";
  }

  if (code === 'auth/too-many-requests' || message.includes('too-many-requests')) {
    return "Too many failed login attempts. This account has been temporarily locked. Please try again later.";
  }

  if (code === 'auth/user-disabled' || message.includes('user-disabled')) {
    return "This account has been disabled. Please contact system administrators.";
  }

  if (code === 'auth/operation-not-allowed' || message.includes('operation-not-allowed')) {
    return "Sign up is currently disabled. Please contact support.";
  }

  if (
    code === 'auth/unauthorized-domain' || 
    message.includes('unauthorized-domain') || 
    message.includes('unauthorized_domain') ||
    (message.includes('unauthorized') && message.includes('domain'))
  ) {
    const devHost = "ais-dev-uxwa3td27wmjxeilw3dk2b-223847268621.asia-east1.run.app";
    const preHost = "ais-pre-uxwa3td27wmjxeilw3dk2b-223847268621.asia-east1.run.app";
    return `Firebase domain unauthorized. Please ensure both "${devHost}" and "${preHost}" are added to the "Authorized Domains" section under Firebase Console > Authentication > Settings.`;
  }

  if (message.startsWith('firebase:')) {
    const match = err.message.match(/Firebase:\s+Error\s+\(([^)]+)\)/i);
    if (match && match[1]) {
      return `Security Error: ${match[1]}`;
    }
  }

  return err.message || "An unexpected error occurred. Please verify your connection.";
}

export default function AuthPage({ theme, toggleTheme }: AuthPageProps) {
  const { signup, login, loginAsGuest, loginWithGoogle } = useAuth();
  
  const [studentMode, setStudentMode] = useState<'login' | 'signup'>('login');

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [classSection, setClassSection] = useState('CS-1');
  const [signupPassword, setSignupPassword] = useState('');

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // UI Interactive States
  const [error, setError] = useState<string | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Keep track of viewport size for responsive slide layouts
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const triggerErrorState = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 500);
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(getFirebaseFriendlyError(err));
      triggerErrorState();
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      triggerErrorState();
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(acropolis\.in|aitr\.acropolis\.in)$/i;
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your college Email ID.");
      triggerErrorState();
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setError("College Email ID must strictly end with @acropolis.in or @aitr.acropolis.in");
      triggerErrorState();
      return;
    }

    const rollRegex = /^0827CS251\d{3}$/i;
    const trimmedRoll = rollNumber.trim().toUpperCase();
    if (!trimmedRoll) {
      setError("Please enter your Enrollment/Roll number.");
      triggerErrorState();
      return;
    }
    
    if (!rollRegex.test(trimmedRoll)) {
      setError("Enrollment number format must be: 0827CS251XXX (where XXX is a 3-digit number).");
      triggerErrorState();
      return;
    }

    if (!classSection) {
      setError("Please select your class & section.");
      triggerErrorState();
      return;
    }

    if (!signupPassword || signupPassword.length < 6) {
      setError("Firebase requires a password with at least 6 characters.");
      triggerErrorState();
      return;
    }

    setLoading(true);
    try {
      await signup(trimmedEmail, signupPassword, fullName.trim(), trimmedRoll, classSection);
    } catch (err: any) {
      console.error(err);
      setError(getFirebaseFriendlyError(err));
      triggerErrorState();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = loginEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Please enter your college Email ID.");
      triggerErrorState();
      return;
    }

    if (!loginPassword) {
      setError("Please enter your password.");
      triggerErrorState();
      return;
    }

    setLoading(true);
    try {
      await login(trimmedEmail, loginPassword);
    } catch (err: any) {
      console.error(err);
      setError(getFirebaseFriendlyError(err));
      triggerErrorState();
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = () => {
    setLoading(true);
    loginAsGuest();
    setLoading(false);
  };

  // Stagger variants for premium input transitions
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { ease: "easeInOut", duration: 0.4 } 
    }
  };

  const isDark = theme === 'dark';

  // Theme-sensitive styles
  const bgClass = isDark ? 'bg-[#120F0D]' : 'bg-[#FDFBF7]';
  const textClass = isDark ? 'text-[#FDFBF7]' : 'text-[#2D2A26]';
  const textMutedClass = isDark ? 'text-stone-400' : 'text-stone-500';
  const textIconClass = isDark ? 'text-stone-500' : 'text-stone-400';
  const borderClass = isDark ? 'border-stone-800' : 'border-[#2D2A26]/20';
  const inputBgClass = isDark ? 'bg-[#1A1614]' : 'bg-white';
  const cardBgClass = isDark ? 'bg-[#1C1816]' : 'bg-white';
  const cardBorderClass = isDark ? 'border-stone-800/80' : 'border-stone-200/60';
  const cardShadowClass = isDark ? 'shadow-[0_8px_40px_rgba(0,0,0,0.5)]' : 'shadow-[0_4px_20px_-4px_rgba(45,42,38,0.05)]';
  const dividerLineClass = isDark ? 'bg-stone-800' : 'bg-stone-100';
  const googleBtnBgClass = isDark ? 'bg-[#1C1816] hover:bg-[#120F0D]' : 'bg-white hover:bg-[#FDFBF7]';
  const themeBtnClass = isDark 
    ? 'border-stone-800 bg-[#1C1816] text-stone-400 hover:text-stone-100 hover:bg-[#120F0D]' 
    : 'border-[#2D2A26]/10 bg-white text-stone-500 hover:text-[#2D2A26] hover:bg-stone-50';
  const guestBtnClass = isDark
    ? 'bg-[#1C1816] border-stone-800 text-[#B13A39] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]'
    : 'bg-white border-[#2D2A26]/10 text-[#7A1F1E] shadow-[0_4px_16px_rgba(45,42,38,0.08)] hover:shadow-[0_6px_20px_rgba(45,42,38,0.12)]';
  
  const accentColor = isDark ? '#B13A39' : '#7A1F1E';
  const brandMaroonBgClass = isDark ? 'bg-[#5C1110]' : 'bg-[#7A1F1E]'; // Premium deeper burgundy sliding overlay in dark mode to blend beautifully with deep espresso

  const errorAlertClass = isDark
    ? 'bg-rose-950/25 border-rose-900/35 text-[#B13A39]'
    : 'bg-rose-50 border-rose-100 text-[#7A1F1E]';

  const inputBorderClass = isVibrating
    ? (isDark ? 'border-[#B13A39]' : 'border-[#7A1F1E]')
    : (isDark ? 'border-stone-800 focus:border-[#B13A39] focus:ring-1 focus:ring-[#B13A39]' : 'border-[#2D2A26]/20 focus:border-[#7A1F1E] focus:ring-1 focus:ring-[#7A1F1E]');

  return (
    <div className={`w-screen h-screen ${bgClass} flex relative transition-colors duration-500 ${isMobile ? 'flex-col overflow-y-auto' : 'overflow-hidden'}`}>
      
      {/* Cinematic Sliding Maroon Visual Panel */}
      <motion.div
        className={`${brandMaroonBgClass} text-[#FDFBF7] flex flex-col justify-between overflow-hidden transition-colors duration-500 ${
          isMobile 
            ? 'w-full py-12 px-6 h-auto shrink-0 relative' 
            : 'w-1/2 h-full absolute top-0 z-20 p-16'
        }`}
        animate={isMobile ? { x: 0, y: 0 } : { x: studentMode === 'login' ? '0%' : '100%' }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        {/* Subtle geometric lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07]">
          <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full border border-white" />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 border border-[#FDFBF7]/30 bg-[#7A1F1E] flex items-center justify-center rounded-lg shadow-inner">
            <span className="text-xl font-serif font-bold text-[#FDFBF7]">L</span>
          </div>
          <div>
            <h1 className="font-serif font-semibold text-lg tracking-wide text-[#FDFBF7]">
              Life Copilot <span className="text-[#FDFBF7]/70 font-normal italic">AI</span>
            </h1>
            <span className="text-[9px] uppercase tracking-widest text-[#FDFBF7]/50 block font-medium">
              AITR Indore Campus OS
            </span>
          </div>
        </div>

        {/* Changing branding copy with micro-crossfade */}
        <div className={`relative z-10 my-auto ${isMobile ? 'my-8' : ''}`}>
          <AnimatePresence mode="wait">
            {studentMode === 'login' ? (
              <motion.div
                key="login-branding"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="max-w-md"
              >
                <span className="text-[10px] uppercase tracking-widest text-[#FDFBF7]/60 font-semibold block mb-2">
                  Established Node Gateway
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-light leading-snug text-[#FDFBF7] tracking-tight">
                  Welcome back, <br />
                  <span className="italic font-normal">buddy.</span>
                </h2>
                <p className="mt-4 text-sm text-[#FDFBF7]/75 font-sans leading-relaxed">
                  Unlock your customized operational workspace. Instantly synchronize course tracks, verify physical block assignments, and navigate college registries with AI intelligence.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="signup-branding"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="max-w-md"
              >
                <span className="text-[10px] uppercase tracking-widest text-[#FDFBF7]/60 font-semibold block mb-2">
                  New System Clearance
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-light leading-snug text-[#FDFBF7] tracking-tight">
                  Begin your <br />
                  <span className="italic font-normal">academic flight.</span>
                </h2>
                <p className="mt-4 text-sm text-[#FDFBF7]/75 font-sans leading-relaxed">
                  Initialize your dedicated campus credentials. Gain protected entry into active timetables, lecture note summaries, local canteen trackers, and community operations boards.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HUD state indicators */}
        <div className="relative z-10 flex justify-between items-center text-[10px] text-[#FDFBF7]/40 tracking-wider font-mono">
          <span>AITR INDORE NODE STATE: OPERATIONAL</span>
          <span>© 2026 ACROPOLIS</span>
        </div>
      </motion.div>

      {/* Warm Beige Form Content Panel */}
      <motion.div
        className={`${bgClass} flex flex-col justify-between transition-colors duration-500 ${
          isMobile 
            ? 'w-full px-6 py-8 h-auto' 
            : 'w-1/2 h-full absolute top-0 z-10 p-16 overflow-y-auto'
        }`}
        animate={isMobile ? { x: 0, y: 0 } : { x: studentMode === 'login' ? '100%' : '0%' }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        {/* Upper HUD containing subtle custom toggle */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold">
            Secure Auth Desk
          </span>

          <button
            onClick={toggleTheme}
            type="button"
            className={`p-2 rounded-full border transition-all duration-200 cursor-pointer shadow-xs ${themeBtnClass}`}
            aria-label="Toggle Theme Mode"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Flat Elegantly Centered Layout Box */}
        <div className="my-auto py-4 w-full max-w-md mx-auto">
          
          <motion.div
            className={`border rounded-2xl p-8 md:p-10 transition-all duration-500 ${cardBgClass} ${cardBorderClass} ${cardShadowClass}`}
            animate={isVibrating ? { x: [-4, 4, -4, 4, -2, 2, 0] } : {}}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Minimal Headings inside Card */}
            <div className="text-center mb-6">
              <h2 className={`font-serif text-3xl font-light tracking-tight transition-colors duration-500 ${textClass}`}>
                Campus Gateway
              </h2>
              <div className="w-8 h-[1px] mx-auto mt-3 transition-colors duration-500" style={{ backgroundColor: accentColor }} />
            </div>

            {/* Segmented Switch Tab Controllers */}
            <div className={`flex justify-center gap-6 mb-8 text-center border-b pb-2 ${isDark ? 'border-stone-800' : 'border-stone-100'}`}>
              <button
                type="button"
                onClick={() => { setError(null); setStudentMode('login'); }}
                className={`text-xs font-semibold uppercase tracking-wider pb-1.5 transition-all border-b-2 cursor-pointer ${
                  studentMode === 'login'
                    ? ''
                    : isDark ? 'text-stone-500 border-transparent hover:text-stone-300' : 'text-stone-400 border-transparent hover:text-stone-600'
                }`}
                style={{ 
                  color: studentMode === 'login' ? accentColor : undefined,
                  borderColor: studentMode === 'login' ? accentColor : undefined
                }}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setError(null); setStudentMode('signup'); }}
                className={`text-xs font-semibold uppercase tracking-wider pb-1.5 transition-all border-b-2 cursor-pointer ${
                  studentMode === 'signup'
                    ? ''
                    : isDark ? 'text-stone-500 border-transparent hover:text-stone-300' : 'text-stone-400 border-transparent hover:text-stone-600'
                }`}
                style={{ 
                  color: studentMode === 'signup' ? accentColor : undefined,
                  borderColor: studentMode === 'signup' ? accentColor : undefined
                }}
              >
                Create Account
              </button>
            </div>

            {/* Render form using staggered animated inputs keyed by mode */}
            <AnimatePresence mode="wait">
              {studentMode === 'login' ? (
                <motion.form
                  key="login-form-panel"
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  onSubmit={handleLoginSubmit}
                  className="space-y-4"
                >
                  {/* Login Email */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label htmlFor="log-email" className={`block text-[10px] font-semibold tracking-widest uppercase ${textMutedClass}`}>
                      College Email ID
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textIconClass}`} />
                      <input
                        id="log-email"
                        type="email"
                        required
                        placeholder="username@acropolis.in"
                        value={loginEmail}
                        onChange={(e) => {
                          setError(null);
                          setLoginEmail(e.target.value);
                        }}
                        disabled={loading}
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm font-sans transition-all ${inputBgClass} ${textClass} ${
                          isDark ? 'placeholder-stone-650' : 'placeholder-[#2D2A26]/40'
                        } ${inputBorderClass}`}
                      />
                    </div>
                  </motion.div>

                  {/* Login Password */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label htmlFor="log-pass" className={`block text-[10px] font-semibold tracking-widest uppercase ${textMutedClass}`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textIconClass}`} />
                      <input
                        id="log-pass"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={(e) => {
                          setError(null);
                          setLoginPassword(e.target.value);
                        }}
                        disabled={loading}
                        className={`w-full pl-11 pr-11 py-3 border rounded-lg text-sm font-sans transition-all ${inputBgClass} ${textClass} ${
                          isDark ? 'placeholder-stone-650' : 'placeholder-[#2D2A26]/40'
                        } ${inputBorderClass}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Validation/Firebase Error Text Pulse */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={`p-3 rounded-lg flex items-start gap-2.5 border text-xs leading-relaxed animate-pulse ${errorAlertClass}`}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-[#FDFBF7] font-medium rounded-lg shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: accentColor }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-[#FDFBF7]/20 border-t-[#FDFBF7] animate-spin" />
                        <span>Securing Connection...</span>
                      </div>
                    ) : (
                      <span>Log In</span>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup-form-panel"
                  variants={containerVariants}
                  initial="initial"
                  animate="animate"
                  onSubmit={handleRegister}
                  className="space-y-3.5"
                >
                  {/* Name */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label htmlFor="reg-name" className={`block text-[10px] font-semibold tracking-widest uppercase ${textMutedClass}`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textIconClass}`} />
                      <input
                        id="reg-name"
                        type="text"
                        required
                        placeholder="e.g. Priyansh Sharma"
                        value={fullName}
                        onChange={(e) => {
                          setError(null);
                          setFullName(e.target.value);
                        }}
                        disabled={loading}
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm font-sans transition-all ${inputBgClass} ${textClass} ${
                          isDark ? 'placeholder-stone-650' : 'placeholder-[#2D2A26]/40'
                        } ${inputBorderClass}`}
                      />
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label htmlFor="reg-email" className={`block text-[10px] font-semibold tracking-widest uppercase ${textMutedClass}`}>
                      College Email ID
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textIconClass}`} />
                      <input
                        id="reg-email"
                        type="email"
                        required
                        placeholder="username@acropolis.in"
                        value={email}
                        onChange={(e) => {
                          setError(null);
                          setEmail(e.target.value);
                        }}
                        disabled={loading}
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm font-sans transition-all ${inputBgClass} ${textClass} ${
                          isDark ? 'placeholder-stone-650' : 'placeholder-[#2D2A26]/40'
                        } ${inputBorderClass}`}
                      />
                    </div>
                    <span className="text-[9px] text-stone-400 block tracking-wide mt-0.5">
                      Must end with @acropolis.in or @aitr.acropolis.in
                    </span>
                  </motion.div>

                  {/* Roll Number */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label htmlFor="reg-roll" className={`block text-[10px] font-semibold tracking-widest uppercase ${textMutedClass}`}>
                      Enrollment / Roll Number
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textIconClass}`} />
                      <input
                        id="reg-roll"
                        type="text"
                        required
                        placeholder="e.g. 0827CS251001"
                        value={rollNumber}
                        onChange={(e) => {
                          setError(null);
                          setRollNumber(e.target.value);
                        }}
                        disabled={loading}
                        className={`w-full pl-11 pr-4 py-3 border rounded-lg text-sm font-sans tracking-wide font-medium transition-all ${inputBgClass} ${textClass} ${
                          isDark ? 'placeholder-stone-650' : 'placeholder-[#2D2A26]/40'
                        } ${inputBorderClass}`}
                        maxLength={12}
                      />
                    </div>
                    <span className="text-[9px] text-stone-400 block tracking-wide mt-0.5">
                      Required Format: 0827CS251XXX
                    </span>
                  </motion.div>

                  {/* Class / Section Dropdown */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label htmlFor="reg-class" className={`block text-[10px] font-semibold tracking-widest uppercase ${textMutedClass}`}>
                      Class &amp; Section
                    </label>
                    <div className="relative">
                      <GraduationCap className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textIconClass} pointer-events-none`} />
                      <select
                        id="reg-class"
                        value={classSection}
                        onChange={(e) => {
                          setError(null);
                          setClassSection(e.target.value);
                        }}
                        disabled={loading}
                        className={`w-full pl-11 pr-10 py-3 border rounded-lg text-sm font-sans cursor-pointer appearance-none transition-all ${inputBgClass} ${textClass} ${inputBorderClass}`}
                      >
                        <option value="CS-1" className={isDark ? "bg-[#1C1816] text-[#FDFBF7]" : "bg-white text-[#2D2A26]"}>Computer Science - Section 1 (CS-1)</option>
                        <option value="CS-2" className={isDark ? "bg-[#1C1816] text-[#FDFBF7]" : "bg-white text-[#2D2A26]"}>Computer Science - Section 2 (CS-2)</option>
                        <option value="CS-3" className={isDark ? "bg-[#1C1816] text-[#FDFBF7]" : "bg-white text-[#2D2A26]"}>Computer Science - Section 3 (CS-3)</option>
                        <option value="CS-4" className={isDark ? "bg-[#1C1816] text-[#FDFBF7]" : "bg-white text-[#2D2A26]"}>Computer Science - Section 4 (CS-4)</option>
                        <option value="CS-5" className={isDark ? "bg-[#1C1816] text-[#FDFBF7]" : "bg-white text-[#2D2A26]"}>Computer Science - Section 5 (CS-5)</option>
                        <option value="CS-6" className={isDark ? "bg-[#1C1816] text-[#FDFBF7]" : "bg-white text-[#2D2A26]"}>Computer Science - Section 6 (CS-6)</option>
                        <option value="Other" className={isDark ? "bg-[#1C1816] text-[#FDFBF7]" : "bg-white text-[#2D2A26]"}>Other Branch (Guest Student)</option>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none rotate-90" />
                    </div>
                  </motion.div>

                  {/* Signup Password */}
                  <motion.div variants={itemVariants} className="space-y-1">
                    <label htmlFor="reg-pass" className={`block text-[10px] font-semibold tracking-widest uppercase ${textMutedClass}`}>
                      Password (6+ characters)
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textIconClass}`} />
                      <input
                        id="reg-pass"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={signupPassword}
                        onChange={(e) => {
                          setError(null);
                          setSignupPassword(e.target.value);
                        }}
                        disabled={loading}
                        className={`w-full pl-11 pr-11 py-3 border rounded-lg text-sm font-sans transition-all ${inputBgClass} ${textClass} ${
                          isDark ? 'placeholder-stone-650' : 'placeholder-[#2D2A26]/40'
                        } ${inputBorderClass}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Validation/Firebase Error Text Pulse */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className={`p-3 rounded-lg flex items-start gap-2.5 border text-xs leading-relaxed animate-pulse ${errorAlertClass}`}
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit button */}
                  <motion.button
                    variants={itemVariants}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-[#FDFBF7] font-medium rounded-lg shadow-sm transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: accentColor }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-[#FDFBF7]/20 border-t-[#FDFBF7] animate-spin" />
                        <span>Initializing Workspace...</span>
                      </div>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Pristine divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className={`absolute inset-x-0 h-[1px] ${dividerLineClass}`} />
              <span className={`relative px-3 text-[9px] font-bold tracking-widest uppercase text-stone-400 z-10 transition-colors duration-500 ${isDark ? 'bg-[#1C1816]' : 'bg-white'}`}>
                OR
              </span>
            </div>

            {/* Clean White Google Authentication button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`w-full py-3 border rounded-lg font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer shadow-xs ${googleBtnBgClass} ${isDark ? 'border-stone-800 text-[#FDFBF7]' : 'border-[#2D2A26]/20 text-[#2D2A26]'}`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

          </motion.div>
        </div>

        {/* HUD Desk Footer */}
        <div className="text-center text-[10px] text-stone-400 font-sans tracking-wide leading-relaxed mt-4">
          <p>Acropolis Institute of Technology and Research, Indore.</p>
          <p className={`mt-0.5 uppercase tracking-widest text-[8px] font-semibold ${isDark ? 'text-stone-500' : 'text-stone-300'}`}>
            SECURE CAMPUS OPERATION AND DIGITAL COMPANION NODE
          </p>
        </div>
      </motion.div>

      {/* Floating Skip Onboarding to Guest Entry Trigger */}
      <motion.button
        type="button"
        onClick={handleGuestEntry}
        disabled={loading}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ scale: 1.02, x: 4 }}
        className={`fixed bottom-6 right-6 z-30 px-5 py-3 border font-medium text-xs tracking-wider uppercase flex items-center gap-2 rounded-full transition-all cursor-pointer ${guestBtnClass}`}
      >
        <span>Skip Onboarding → Enter as Guest</span>
      </motion.button>

    </div>
  );
}
