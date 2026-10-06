import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Bot, 
  User, 
  Menu, 
  X, 
  Plus, 
  Sparkles, 
  Compass, 
  ShoppingCart, 
  CheckCircle, 
  MapPin, 
  AlertCircle, 
  Play, 
  Info,
  Clock,
  DollarSign
} from 'lucide-react';
import { SearchState, ChatMessage, SavedChat, VendorOption } from '../types';
import { findBestOption } from '../mockCampusData';

interface ChatInterfaceProps {
  initialSearch: SearchState | null;
  savedChats: SavedChat[];
  onSaveChats: (chats: SavedChat[]) => void;
  onBackToSearch: () => void;
  theme: 'dark' | 'light';
}

export default function ChatInterface({ 
  initialSearch, 
  savedChats, 
  onSaveChats, 
  onBackToSearch, 
  theme 
}: ChatInterfaceProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Handle Initial Search Submissions
  useEffect(() => {
    if (initialSearch) {
      // Check if a chat already exists for this query or start a new one
      const timestampString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newChatId = 'chat-' + Date.now();
      
      const userMsg: ChatMessage = {
        id: 'msg-u1',
        sender: 'user',
        timestamp: timestampString,
        text: `Search Diagnostic for: "${initialSearch.itemQuery}" (Budget: ₹${initialSearch.maxBudget}, Time limit: ${initialSearch.maxTime})`,
        searchContext: initialSearch
      };

      setMessages([userMsg]);
      setCurrentChatId(newChatId);
      triggerAiEvaluation(initialSearch, [userMsg], newChatId);
    }
  }, [initialSearch]);

  const triggerAiEvaluation = (searchState: SearchState, currentMsgs: ChatMessage[], chatId: string) => {
    setTyping(true);
    
    setTimeout(() => {
      // Calculate optimized recommendation output using our custom logic engine
      const rec = findBestOption(searchState.itemQuery, searchState.maxBudget, searchState.maxTime);
      const timestampString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Let's craft explanatory chatbot texts
      let explText = `Greetings! I have analyzed the AITR Indore campus network and compiled optimal solutions for your target: **"${searchState.itemQuery}"**.\n\n`;
      if (rec.winner) {
        explText += `Based on your constraint framework of **Budget: ₹${searchState.maxBudget}** and **Time: ${searchState.maxTime}**, I have identified **${rec.winner.vendorName}** as the optimal fulfillment source.`;
      } else {
        explText += `I'm analyzing multiple off-campus nodes to fullfil the query. Here's a comparative view of potential sources:`;
      }

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'assistant',
        timestamp: timestampString,
        text: explText,
        recommendations: rec
      };

      const updatedMsgs = [...currentMsgs, aiMsg];
      setMessages(updatedMsgs);
      setTyping(false);

      // Save into historical list
      saveChatSession(chatId, searchState.itemQuery, updatedMsgs);
    }, 1800);
  };

  const saveChatSession = (id: string, queryText: string, msgs: ChatMessage[]) => {
    const existingIndex = savedChats.findIndex(c => c.id === id);
    const dateStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric' });
    const titleText = `Query: ${queryText.charAt(0).toUpperCase() + queryText.slice(1)}`;

    let newSaved: SavedChat[] = [...savedChats];
    
    if (existingIndex >= 0) {
      newSaved[existingIndex] = {
        ...newSaved[existingIndex],
        messages: msgs
      };
    } else {
      newSaved = [
        {
          id,
          title: titleText,
          timestamp: dateStr,
          messages: msgs
        },
        ...newSaved
      ];
    }
    onSaveChats(newSaved);
  };

  const handleSelectHistoryChat = (chat: SavedChat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
    setSidebarOpen(false);
  };

  const handleStartNewChat = () => {
    setSidebarOpen(false);
    onBackToSearch();
  };

  const handleSendPromptMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    const timestampString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      sender: 'user',
      timestamp: timestampString,
      text: userText
    };

    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInputValue('');
    setTyping(true);

    // AI contextual follow up reaction
    setTimeout(() => {
      // Perform regular conversational search if query resembles standard item,
      // or answer helpful FAQ related to Indore/Acropolis
      const timestampString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let aiResponseText = '';
      
      const queryLower = userText.toLowerCase();

      if (queryLower.includes('exam') || queryLower.includes('syllabus') || queryLower.includes('practical')) {
        aiResponseText = `AITR examination guidelines require mandatory submission of practical files 4 days ahead of external tests. You can quickly secure official graphics drawing sheets at standard rates of ₹10 in Block B Basement.`;
      } else if (queryLower.includes('poha') || queryLower.includes('indore') || queryLower.includes('breakfast')) {
        aiResponseText = `Indori Poha is served hot at Manasvi Foods Canteen every morning from 8:00 AM for just ₹25. If you prefer regional authentic flavor, Manglia Square local outlets serve spicy Jeeravan poha for ₹20.`;
      } else if (queryLower.includes('online') || queryLower.includes('delivery')) {
        aiResponseText = `For online vendors like Amazon or Blinkit, always designate the pickup spot at 'Main Campus Gate 1'. Instamart deliveries usually request student details near the main security barrier.`;
      } else {
        // Run general matching to support continuous chat search!
        const rec = findBestOption(userText, 2000, "Any time");
        const aiMsg: ChatMessage = {
          id: 'msg-ai-chat-' + Date.now(),
          sender: 'assistant',
          timestamp: timestampString,
          text: `Analyzing: "${userText}"...\nHere's what I determined based on real-time AITR campus pricing:`,
          recommendations: rec
        };
        const nextMsgsWithAi = [...nextMsgs, aiMsg];
        setMessages(nextMsgsWithAi);
        setTyping(false);
        saveChatSession(currentChatId, userText, nextMsgsWithAi);
        return;
      }

      const aiMsg: ChatMessage = {
        id: 'msg-ai-chat-' + Date.now(),
        sender: 'assistant',
        timestamp: timestampString,
        text: aiResponseText
      };

      const nextMsgsWithAi = [...nextMsgs, aiMsg];
      setMessages(nextMsgsWithAi);
      setTyping(false);
      saveChatSession(currentChatId, userText, nextMsgsWithAi);
    }, 1500);
  };

  return (
    <div className={`flex h-[calc(100vh-100px)] w-full relative overflow-hidden rounded-3xl border ${theme === 'dark' ? 'border-zinc-800 bg-[#050505]' : 'border-gray-250 bg-white shadow-xl'} font-sans`}>
      
      {/* 1. Sidebar Panel (History Log) */}
      <aside className={`absolute md:relative inset-y-0 left-0 w-72 z-30 transition-transform duration-300 transform border-r flex flex-col justify-between ${
        theme === 'dark' ? 'bg-[#09090d] border-zinc-900 text-white' : 'bg-gray-50/95 border-gray-150 text-gray-900'
      } ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-4.5 border-b border-zinc-900 flex justify-between items-center bg-black/10">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-[6px] bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono font-black tracking-widest uppercase">
              COPILOT OS
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Start New Diagnostic Button */}
        <div className="p-4">
          <button
            onClick={handleStartNewChat}
            className={`w-full py-3 px-4 rounded-xl text-xs font-display font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border ${
              theme === 'dark' 
                ? 'bg-white text-black hover:bg-purple-400 border-transparent shadow-[0_4px_15px_rgba(168,85,247,0.15)] font-black' 
                : 'bg-black text-white hover:bg-purple-600 border-transparent font-black'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>New Session</span>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2 mt-2">
            Recent consultations
          </p>
          
          {savedChats.length === 0 ? (
            <div className="px-3 py-6 text-xs text-zinc-500 italic text-center">
              No historical data logs.
            </div>
          ) : (
            savedChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleSelectHistoryChat(chat)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex flex-col gap-1 ${
                  currentChatId === chat.id 
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                    : 'text-zinc-450 hover:text-white hover:bg-zinc-900/40 border border-transparent'
                }`}
              >
                <div className="font-display font-extrabold text-xs tracking-tight uppercase truncate w-full">
                  {chat.title}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 flex justify-between items-center w-full">
                  <span>AITR Server</span>
                  <span>{chat.timestamp}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* System Terminal Info */}
        <div className="p-4 border-t border-zinc-900 bg-black/10 text-[10px] font-mono text-zinc-500 flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-emerald-500 font-bold uppercase">Live Diagnostics</span>
          </div>
          <div className="flex justify-between">
            <span>Server:</span>
            <span>IN-AITR-GPWS</span>
          </div>
        </div>

      </aside>

      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/50 md:hidden backdrop-blur-xs"
        />
      )}

      {/* 2. Main Chat Workspace */}
      <div className="flex-1 flex flex-col bg-transparent relative">
        
        {/* Workspace Toolbar Header */}
        <header className={`p-4 border-b flex flex-wrap justify-between items-center gap-3 transition-all ${
          theme === 'dark' ? 'border-zinc-800 bg-[#050505]/75' : 'border-gray-200 bg-white/45'
        }`}>
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl border border-zinc-805 text-zinc-400 hover:text-white"
              aria-label="Open sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Prominent Return to Dashboard Hyperlink / Button */}
            <button
              onClick={onBackToSearch}
              className="px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm bg-[#7A1F1E] text-white hover:bg-[#5C1716] border-[#7A1F1E]"
              title="Return to Dashboard Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5px]" />
              <span className="font-sans font-bold">← Return to Dashboard</span>
            </button>

            <button
              onClick={onBackToSearch}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                theme === 'dark'
                  ? 'border-zinc-800 bg-zinc-900 text-blue-400 hover:bg-zinc-800 hover:text-white'
                  : 'border-stone-200 bg-stone-100 text-blue-700 hover:bg-stone-200'
              }`}
              title="Open Unified Campus Map & Food Locator"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>Campus Map &amp; Food Locator</span>
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-black text-sm tracking-tight uppercase">Active Consultation Hub</h3>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <p className={`text-[10px] font-mono uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-500' : 'text-neutral-400'}`}>
                Acropolis Indore Copilot Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20 max-sm:hidden">
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-purple-400 font-mono text-[9px] uppercase tracking-wider">● ANTIGRAVITY v1.0</span>
          </div>
        </header>

        {/* Message Feeds Scroll Container */}
        <div className={`flex-1 overflow-y-auto p-6 max-md:p-4 space-y-6 ${
          theme === 'dark' ? 'bg-[#050505]/40' : 'bg-gray-50/10'
        }`}>
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar Icon */}
              {msg.sender === 'assistant' && (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 bg-purple-500/10 border-purple-500/20 text-purple-400">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              {/* Message content bubble */}
              <div className={`max-w-[85%] md:max-w-2xl flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Meta details */}
                <div className="flex items-center gap-2 text-[9px] text-zinc-550 px-1 font-mono uppercase tracking-wider">
                  <span>{msg.sender === 'user' ? 'Indore Cadet' : 'Copilot Core'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className={`rounded-2xl p-4 text-sm leading-relaxed border shadow-xs ${
                  msg.sender === 'user'
                    ? theme === 'dark'
                      ? 'bg-zinc-900/40 border-zinc-800 text-zinc-100'
                      : 'bg-indigo-600/5 border-indigo-100 text-gray-900'
                    : theme === 'dark'
                      ? 'bg-zinc-900/20 border-zinc-800 text-white'
                      : 'bg-white border-gray-150 text-gray-900 shadow-sm'
                }`}>
                  
                  {/* Markdown / text output */}
                  <p className="whitespace-pre-wrap font-sans font-medium">{msg.text}</p>

                  {/* Recommendation Grid Block (IF PRE-CALCULATED BY ENGINE) */}
                  {msg.recommendations && (
                    <div className="mt-5 space-y-6">
                      
                      {/* --- Comparative Options Table --- */}
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5 mb-3">
                          <Compass className="w-4 h-4" />
                          <span>Campus Availability Matrix</span>
                        </h4>
                        
                        <div className={`overflow-x-auto rounded-[18px] border ${
                          theme === 'dark' ? 'border-zinc-800 bg-[#09090c]/90' : 'border-gray-200 bg-white'
                        }`}>
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className={`border-b ${
                                theme === 'dark' ? 'border-zinc-800 bg-[#0f0f15] text-zinc-400' : 'border-gray-200 bg-gray-50 text-gray-700'
                              }`}>
                                <th className="p-3 font-black uppercase tracking-widest text-[9px]">Vendor Node</th>
                                <th className="p-3 font-black uppercase tracking-widest text-[9px]">Specification</th>
                                <th className="p-3 font-black uppercase tracking-widest text-[9px] text-center">Cost</th>
                                <th className="p-3 font-black uppercase tracking-widest text-[9px] text-center">Access Time</th>
                                <th className="p-3 font-black uppercase tracking-widest text-[9px]">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {msg.recommendations.options.map((opt, i) => {
                                const isWinnerNode = msg.recommendations?.winner?.vendorName === opt.vendorName;
                                return (
                                  <tr 
                                    key={i} 
                                    className={`border-b transition-colors ${
                                      theme === 'dark' ? 'border-zinc-900' : 'border-gray-100'
                                    } ${
                                      isWinnerNode 
                                        ? theme === 'dark' 
                                          ? 'bg-purple-950/20 font-extrabold text-purple-300' 
                                          : 'bg-purple-50 font-extrabold text-purple-900'
                                        : theme === 'dark' ? 'hover:bg-zinc-800/20' : 'hover:bg-gray-50'
                                    }`}
                                  >
                                    <td className="p-3 whitespace-nowrap">
                                      <div className="flex flex-col">
                                        <span className="flex items-center gap-1.5 font-bold">
                                          {isWinnerNode && <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-mono font-bold tracking-widest">WINNER</span>}
                                          {opt.vendorName}
                                        </span>
                                        <span className={`text-[10px] ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>{opt.locationInfo}</span>
                                      </div>
                                    </td>
                                    <td className={`p-3 ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-700'}`}>
                                      {opt.itemName}
                                    </td>
                                    <td className="p-3 text-center font-mono text-emerald-500 dark:text-emerald-400 font-bold whitespace-nowrap">
                                      ₹{opt.price}
                                    </td>
                                    <td className={`p-3 text-center font-mono ${theme === 'dark' ? 'text-zinc-300' : 'text-gray-600'}`}>
                                      {opt.timeText}
                                    </td>
                                    <td className="p-3 whitespace-nowrap">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider ${
                                        opt.availability.includes('In Stock') || opt.availability.includes('Fast')
                                          ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20'
                                          : 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20'
                                      }`}>
                                        {opt.availability}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* --- Winner Highlighting Card --- */}
                      {msg.recommendations.winner && (
                        <div className={`p-6 rounded-[24px] border transition-all ${
                          theme === 'dark' 
                            ? 'bg-gradient-to-br from-[#0c0c12] to-[#040406] border-purple-500/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' 
                            : 'bg-purple-50/70 border-purple-200 shadow-sm'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="space-y-1.5">
                              <span className="inline-flex items-center gap-1 text-[8px] font-mono tracking-widest bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5 uppercase font-black">
                                Recommendation Approved
                              </span>
                              <h4 className={`font-display font-black text-xl uppercase tracking-tight ${
                                theme === 'dark' ? 'text-white' : 'text-purple-950'
                              }`}>
                                {msg.recommendations.winner.vendorName}
                              </h4>
                              <p className={`text-xs leading-relaxed font-medium ${
                                theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'
                              }`}>
                                {msg.recommendations.winner.itemName} satisfies your requirements for {msg.recommendations.searchedItem} at a optimized rate.
                              </p>
                              
                              <div className="flex flex-wrap gap-3 pt-2 text-xs font-mono uppercase tracking-wider">
                                <span className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-bold">
                                  <DollarSign className="w-3.5 h-3.5" /> ₹{msg.recommendations.winner.price} Only
                                </span>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-bold ${
                                  theme === 'dark' 
                                    ? 'text-zinc-400 bg-zinc-900/40 border-zinc-800' 
                                    : 'text-gray-700 bg-white border-gray-200'
                                }`}>
                                  <Clock className="w-3.5 h-3.5 text-purple-400" /> {msg.recommendations.winner.timeText}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                              <button
                                onClick={onBackToSearch}
                                type="button"
                                className={`px-3.5 py-2.5 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition border cursor-pointer ${
                                  theme === 'dark'
                                    ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-500/30'
                                    : 'bg-rose-50 hover:bg-rose-100 text-[#7A1F1E] border-rose-200'
                                }`}
                                title="Open Campus Food Map"
                              >
                                <MapPin className="w-4 h-4 text-[#7A1F1E] dark:text-rose-400" />
                                <span>Locate on Map</span>
                              </button>

                              {/* Cart direct link simulation */}
                              {msg.recommendations.winner.direct_link && (
                                <button
                                  onClick={() => window.open(msg.recommendations?.winner?.direct_link, '_blank', 'noreferrer')}
                                  type="button"
                                  className={`px-4 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-widest flex items-center gap-2 shrink-0 transition border cursor-pointer ${
                                    theme === 'dark'
                                      ? 'bg-purple-500 hover:bg-purple-450 text-white border-purple-400/20 shadow-[0_5px_15px_rgba(168,85,247,0.3)]'
                                      : 'bg-purple-600 hover:bg-purple-500 text-white border-purple-500/20'
                                  }`}
                                >
                                  <ShoppingCart className="w-4 h-4 stroke-[2.5px]" />
                                  <span>Order Online</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Alternative Checkout CTA (If runner up handles cart URLs) */}
                      {msg.recommendations.alternative && msg.recommendations.alternative.direct_link && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => window.open(msg.recommendations?.alternative?.direct_link, '_blank', 'noreferrer')}
                            type="button"
                            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 text-[10px] font-display uppercase tracking-wider flex items-center gap-2 cursor-pointer transition font-bold"
                          >
                            <ShoppingCart className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Alternate: Order on {msg.recommendations.alternative.vendorName} (₹{msg.recommendations.alternative.price})</span>
                          </button>
                        </div>
                      )}

                      {/* --- Smart Action Plan: Next Steps --- */}
                      <div className={`p-5 rounded-[20px] border ${
                        theme === 'dark' ? 'bg-[#0a0a0f] border-zinc-800' : 'bg-gray-50 border-gray-150'
                      }`}>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#f59e0b] flex items-center gap-1.5 mb-3">
                          <CheckCircle className="w-4 h-4 text-amber-500" />
                          <span>🎯 Next Steps to fulfill</span>
                        </h4>
                        <ul className="space-y-2 text-xs">
                          {msg.recommendations.actionPlan.map((step, sIdx) => (
                            <li key={sIdx} className="flex gap-2.5 items-start leading-relaxed text-zinc-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                              <span className="font-medium">{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  )}

                  {/* Quick Action Return Hyperlinks inside Message */}
                  {msg.sender === 'assistant' && (
                    <div className="mt-4 pt-3 border-t border-zinc-800/40 flex flex-wrap items-center gap-3">
                      <button
                        onClick={onBackToSearch}
                        type="button"
                        className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition underline underline-offset-2"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>← Return to Dashboard</span>
                      </button>
                      <span className="text-zinc-600 text-[10px]">•</span>
                      <button
                        onClick={onBackToSearch}
                        type="button"
                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition underline underline-offset-2"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>🗺️ Open Campus Map &amp; Room Finder</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 bg-zinc-800 border-zinc-700 text-gray-300">
                  <User className="w-5 h-5 bg-transparent" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {typing && (
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 bg-purple-500/10 border-purple-500/20 text-purple-400">
                <Bot className="w-5 h-5 animate-bounce" />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="text-[9px] text-zinc-550 px-1 font-mono uppercase tracking-wider">
                  Copilot Compiler
                </div>
                <div className={`rounded-2xl p-4 text-sm border ${
                  theme === 'dark' ? 'bg-zinc-900/10 border-zinc-850 text-zinc-300' : 'bg-white border-gray-200 text-gray-600 shadow-sm'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs font-mono ml-1 text-zinc-500 uppercase tracking-wide">Retrieving AITR node stats...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Text Form Area */}
        <footer className={`p-4 border-t transition-all ${
          theme === 'dark' ? 'border-zinc-800 bg-[#050505]/75' : 'border-gray-250 bg-white/45'
        }`}>
          <form onSubmit={handleSendPromptMessage} className="flex gap-3">
            <input
              type="text"
              required
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Copilot: 'Recommend quick Poha', 'Physics lab sheet details', 'Blinkit gate-drop rules'..."
              className={`flex-1 px-4 py-3 rounded-xl text-sm transition-all outline-none border font-medium ${
                theme === 'dark'
                  ? 'bg-[#09090d] border-zinc-800 text-white placeholder-zinc-650 focus:border-purple-500/80 shadow-inner'
                  : 'bg-white border-gray-200 text-gray-950 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 shadow-sm'
              }`}
            />
            <button
              type="submit"
              className={`px-5 py-3 rounded-xl text-xs font-display font-black uppercase tracking-widest flex items-center gap-1.5 transition cursor-pointer border ${
                theme === 'dark'
                  ? 'bg-white text-black hover:bg-purple-400 border-transparent shadow-[0_4px_15px_rgba(255,255,255,0.06)]'
                  : 'bg-violet-600 hover:bg-violet-500 text-white border-violet-500/20 shadow-md'
              }`}
            >
              <Play className="w-3.5 h-3.5 stroke-[3px]" />
              <span className="max-sm:hidden">Send</span>
            </button>
          </form>
          <p className="text-[10px] text-center mt-2 text-zinc-550 font-mono uppercase tracking-wider">
            AITR Indore Offline Mock Mode
          </p>
        </footer>
      </div>

    </div>
  );
}
