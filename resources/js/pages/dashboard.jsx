import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Ensure axios is installed or available
import LoadingBoot from './loadingBoot'; 
import { 
  BookOpen, Coffee, Sun, Moon, Leaf, Plus, Check, X, Trash2, 
  Settings, Tag, CalendarDays, AlignLeft, Cloud, Wind, Quote, List, Droplets
} from 'lucide-react';

// --- HELPERS ---
const formatDate = (date) => date.toISOString().split('T')[0];

const getWeekDays = (referenceDate) => {
    const days = [];
    const date = new Date(referenceDate);
    // Adjust to start of week (Sunday) or just show surrounding days. 
    // Let's show a rolling window or current week. Here: Current Week (Sun-Sat)
    const dayOfWeek = date.getDay(); 
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push({
            date: formatDate(d),
            num: d.getDate(),
            name: d.toLocaleDateString('en-US', { weekday: 'long' }),
            isToday: formatDate(d) === formatDate(new Date())
        });
    }
    return days;
};

// --- MAIN COMPONENT ---
const DashboardBotanical = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // State: Dates & View
  const [activeDate, setActiveDate] = useState(formatDate(new Date())); // YYYY-MM-DD
  const [weekDays, setWeekDays] = useState([]);
  const [viewMode, setViewMode] = useState('routine'); 
  const [expandedHabit, setExpandedHabit] = useState(null);
  
  // State: Data
  const [habits, setHabits] = useState([]);
  const [dailyLog, setDailyLog] = useState({ mood: null, gratitude: '' });
  const [settings, setSettings] = useState({});

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Modals & UI
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Debounce for text inputs (Gratitude/Notes)
  const debounceRef = useRef(null);

  // --- INITIALIZATION ---
  
  useEffect(() => {
    // Generate week days for the UI strip
    setWeekDays(getWeekDays(new Date()));
    fetchDashboard(activeDate);
  }, [activeDate]);

 const fetchDashboard = async (date) => {
    try {
        const response = await axios.get(`/dashboard?date=${date}`);
        const { habits, dailyLog, settings } = response.data;
        
        setHabits(habits);
        setDailyLog(dailyLog);
        setSettings(settings);
        
        // REMOVE THIS LINE:
        // setIsLoading(false); 
    } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        // REMOVE THIS LINE:
        // setIsLoading(false);
    }
  };

  // --- ACTIONS ---

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // Toggle Status: Pending <-> Completed
  const toggleComplete = async (id) => {
    // Optimistic Update
    const habitIndex = habits.findIndex(h => h.id === id);
    const habit = habits[habitIndex];
    const newStatus = habit.status === 'completed' ? 'pending' : 'completed';
    
    // Update local state immediately for snappy UI
    const updatedHabits = [...habits];
    updatedHabits[habitIndex] = { ...habit, status: newStatus };
    // Also update the last history item (today in context of the array) if viewing today
    if (activeDate === formatDate(new Date())) {
        const historyLen = updatedHabits[habitIndex].history.length;
        updatedHabits[habitIndex].history[historyLen - 1] = newStatus === 'completed' ? 1 : 0;
    }
    setHabits(updatedHabits);

    if (newStatus === 'completed') showToast("Routine completed.");

    // API Call
    try {
        await axios.post('/entries/toggle', {
            habit_id: id,
            date: activeDate,
            status: newStatus
        });
        // Optional: fetchDashboard(activeDate) to ensure sync
    } catch (error) {
        console.error("Toggle failed", error);
        // Revert on error if needed
    }
  };

  const toggleSkip = async (id) => {
    const habit = habits.find(h => h.id === id);
    const newStatus = habit.status === 'skipped' ? 'pending' : 'skipped';

    setHabits(habits.map(h => h.id === id ? { ...h, status: newStatus } : h));

    try {
        await axios.post('/entries/toggle', {
            habit_id: id,
            date: activeDate,
            status: newStatus
        });
    } catch (error) {
        console.error("Skip failed", error);
    }
  };

  const deleteHabit = async (id) => {
      if(!confirm("Are you sure you want to delete this routine?")) return;
      
      setHabits(habits.filter(h => h.id !== id));
      showToast("Routine removed.");

      try {
          await axios.delete(`/habits/${id}`);
      } catch (error) {
          console.error("Delete failed", error);
      }
  };

  const saveNote = async (id, note) => {
      // Local update
      setHabits(habits.map(h => h.id === id ? { ...h, note } : h));
      
      // Debounced API call
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
          try {
              await axios.post('/entries/note', {
                  habit_id: id,
                  date: activeDate,
                  note: note
              });
          } catch (error) {
              console.error("Save note failed", error);
          }
      }, 1000);
  };

  const handleAddHabit = async (newHabitData) => {
      try {
          await axios.post('/habits', newHabitData);
          setIsAddModalOpen(false);
          showToast("New routine added.");
          fetchDashboard(activeDate); // Refresh list
      } catch (error) {
          console.error("Add failed", error);
          alert("Failed to add habit. Check console.");
      }
  };

  // Toggle specific history item (for the calendar view)
  const toggleHistoryItem = async (habitId, index) => {
      // Calculate the specific date for this history index
      // The backend returns 14 days ending at 'activeDate'.
      // Index 13 = activeDate. Index 0 = activeDate - 13 days.
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const newHistory = [...habit.history];
      const currentVal = newHistory[index];
      const newVal = currentVal === 1 ? 0 : 1;
      newHistory[index] = newVal;

      // Update Local State
      setHabits(habits.map(h => h.id === habitId ? { ...h, history: newHistory } : h));

      // Calculate Date string for API
      const daysAgo = 13 - index;
      const targetDate = new Date(activeDate);
      targetDate.setDate(targetDate.getDate() - daysAgo);
      const targetDateStr = formatDate(targetDate);

      try {
        await axios.post('/entries/toggle', {
            habit_id: habitId,
            date: targetDateStr,
            status: newVal === 1 ? 'completed' : 'pending'
        });
      } catch (error) {
        console.error("History toggle failed", error);
      }
  };

  // Daily Log Actions
  const updateDailyLog = async (field, value) => {
      const newLog = { ...dailyLog, [field]: value };
      setDailyLog(newLog);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
            await axios.post('/dailylog', {
                date: activeDate,
                mood: field === 'mood' ? value : dailyLog.mood,
                gratitude: field === 'gratitude' ? value : dailyLog.gratitude
            });
        } catch (error) {
            console.error("Log update failed", error);
        }
      }, 500); // 500ms debounce
  };

  const calculateProgress = () => {
      if (habits.length === 0) return 0;
      const completed = habits.filter(h => h.status === 'completed').length;
      return Math.round((completed / habits.length) * 100);
  };

  // --- THEME STYLES ---
  const theme = {
      bg: isDarkMode ? 'bg-[#1a1c19]' : 'bg-[#F2F0E9]',
      textPrimary: isDarkMode ? 'text-[#e4e2dd]' : 'text-[#2C3628]',
      textSecondary: isDarkMode ? 'text-[#8c918a]' : 'text-[#9C9C9C]',
      textMuted: isDarkMode ? 'text-[#5c615a]' : 'text-[#D1D1D1]',
      containerBg: isDarkMode ? 'bg-[#232622]' : 'bg-[#FDFCF8]',
      cardBg: isDarkMode ? 'bg-[#2c2f2b]' : 'bg-white',
      cardHover: isDarkMode ? 'hover:border-[#4a5247]' : 'hover:border-[#DCE3DA]',
      border: isDarkMode ? 'border-[#363a34]' : 'border-[#E6E4DC]',
      borderDashed: isDarkMode ? 'border-[#363a34]' : 'border-[#E6E4DC]',
      accentBg: isDarkMode ? 'bg-[#363a34]' : 'bg-[#DCE3DA]',
      accentText: isDarkMode ? 'text-[#d4d9d1]' : 'text-[#2C3628]',
      inputBg: isDarkMode ? 'bg-[#1a1c19]' : 'bg-[#F9F8F6]',
      buttonPrimary: isDarkMode ? 'bg-[#4a5247] text-white' : 'bg-[#2C3628] text-white',
      buttonGhost: isDarkMode ? 'bg-[#2c2f2b] border-[#363a34] text-[#8c918a] hover:bg-[#363a34]' : 'bg-white border-[#E6E4DC] text-[#9C9C9C] hover:border-[#DCE3DA]',
      toggleBg: isDarkMode ? 'bg-[#1a1c19] border-[#363a34]' : 'bg-[#F2F0E9] border-[#E6E4DC]',
      activeToggle: isDarkMode ? 'bg-[#363a34] text-[#e4e2dd]' : 'bg-white text-[#2C3628]',
      inactiveToggle: isDarkMode ? 'text-[#5c615a] hover:text-[#e4e2dd]' : 'text-[#9C9C9C] hover:text-[#2C3628]',
      footerBg: isDarkMode ? 'bg-[#1e211d]' : 'bg-[#F8F7F2]',
      quoteBg: isDarkMode ? 'bg-[#1e211d]' : 'bg-[#F4F6F4]',
  };

  // --- RENDER HELPERS ---

  const renderRoutineView = () => (
    <>
      {renderSection("Morning Ritual", "morning")}
      {renderSection("Afternoon Focus", "afternoon")}
      {renderSection("Evening Wind Down", "evening")}
    </>
  );

  const renderSection = (title, periodKey) => {
    const periodHabits = habits.filter(h => h.period === periodKey);
    return (
      <div className="mb-8 md:mb-10 animate-fade-in-up">
        <h3 className={`font-sans text-xs font-bold uppercase mb-4 flex items-center gap-2 ${theme.textSecondary}`}>
            {title} <div className={`h-px flex-1 ${isDarkMode ? 'bg-[#363a34]' : 'bg-[#E6E4DC]'}`}></div>
        </h3>
        <div className="space-y-4">
            {periodHabits.length > 0 ? (
                periodHabits.map(habit => (
                <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    expanded={expandedHabit === habit.id}
                    onExpand={() => setExpandedHabit(expandedHabit === habit.id ? null : habit.id)}
                    onComplete={() => toggleComplete(habit.id)}
                    onSkip={() => toggleSkip(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                    onUpdateNote={(val) => saveNote(habit.id, val)}
                    theme={theme}
                /> 
                ))
            ) : (
                <div className={`text-center p-6 border border-dashed rounded-2xl text-sm italic ${theme.borderDashed} ${theme.textSecondary} ${isDarkMode ? 'bg-[#1e211d]' : 'bg-[#FBFBF9]'}`}>
                    No routines scheduled.
                </div>
            )}
        </div>
      </div>
    );
  };

  const renderCalendarView = () => (
    <div className="grid grid-cols-1 gap-4 mb-10 animate-fade-in-up">
        {habits.map(habit => (
            <HabitCalendarCard 
                key={habit.id}
                habit={habit}
                // We pass the currently selected day to help render dates correctly
                activeDate={activeDate} 
                onToggleHistory={(index) => toggleHistoryItem(habit.id, index)}
                theme={theme}
            />
        ))}
        {habits.length === 0 && (
             <div className={`col-span-full text-center p-12 border border-dashed rounded-3xl text-sm italic ${theme.borderDashed} ${theme.textSecondary} ${isDarkMode ? 'bg-[#1e211d]' : 'bg-[#FBFBF9]'}`}>
                Start by adding a new habit.
            </div>
        )}
    </div>
  );

  const styles = `
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
  `;

  // Get Name of current Active Day for Header
  const activeDayObj = weekDays.find(d => d.date === activeDate);
  const headerTitle = activeDayObj ? activeDayObj.name : 'Today';

  return (
    <>
      {isLoading && <LoadingBoot onFinished={() => setIsLoading(false)} />}
      
      <div className={`min-h-screen font-serif p-2 sm:p-4 md:p-8 flex justify-center items-start transition-colors duration-500 ${theme.bg} ${theme.textPrimary}`}>
        <style>{styles}</style>
        
        {/* Main Container */}
        <div className={`w-full max-w-4xl min-h-[85vh] md:min-h-[92vh] rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border relative flex flex-col transition-all duration-300 z-10 my-auto ${theme.containerBg} ${theme.border}`}>
          
          {/* Tabs (Decoration) */}
          <div className="hidden lg:block absolute -right-3 top-24 space-y-2">
              <div className={`w-4 h-12 rounded-r-lg shadow-sm cursor-pointer ${theme.buttonPrimary}`} title="Today"></div>
              <div className={`w-4 h-12 rounded-r-lg shadow-sm cursor-pointer ${theme.border} bg-current opacity-20`} title="Calendar"></div>
          </div>

          {/* Texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0 rounded-3xl md:rounded-[2.5rem]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          {/* HEADER */}
          <div className="relative z-10 p-6 md:p-12 pb-2 md:pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                  
                  {/* TITLE */}
                  <div className="animate-fade-in-up">
                      <span className={`block text-xs md:text-sm font-sans tracking-widest uppercase mb-1 ${theme.textSecondary}`}>
                          {viewMode === 'routine' ? new Date(activeDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Consistency Overview"}
                      </span>
                      <h1 className={`text-3xl sm:text-4xl md:text-5xl leading-tight font-medium ${theme.textPrimary}`}>
                          {viewMode === 'routine' ? headerTitle : "Last 7 Days"}
                      </h1>
                  </div>
                  
                  <div className="flex gap-3 items-center">
                      {/* View Switcher */}
                      <div className={`flex rounded-full p-1 border ${theme.toggleBg}`}>
                          <button onClick={() => setViewMode('routine')} className={`p-2 rounded-full transition-all ${viewMode === 'routine' ? 'bg-white shadow-sm text-[#2C3628] dark:text-black' : theme.inactiveToggle}`}>
                              <List size={18} />
                          </button>
                          <button onClick={() => setViewMode('calendar')} className={`p-2 rounded-full transition-all ${viewMode === 'calendar' ? 'bg-white shadow-sm text-[#2C3628] dark:text-black' : theme.inactiveToggle}`}>
                              <CalendarDays size={18} />
                          </button>
                      </div>

                      {/* Theme Toggle */}
                      <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ${theme.buttonGhost}`}>
                          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                      </button>

                      {/* Progress */}
                      <button onClick={() => setIsSettingsModalOpen(true)} className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all group shrink-0 ${theme.buttonGhost}`}>
                        <span className={`font-sans font-bold text-xs md:text-sm group-hover:hidden ${theme.textPrimary}`}>{calculateProgress()}%</span>
                        <Settings size={20} className="hidden group-hover:block" />
                      </button>
                  </div>
              </div>

              {/* QUOTE */}
              {viewMode === 'routine' && (
                  <div className={`mb-8 p-6 rounded-2xl border flex items-start gap-4 animate-fade-in-up ${theme.quoteBg} ${theme.border}`}>
                      <Quote size={20} className={`shrink-0 mt-1 ${theme.textSecondary}`} />
                      <div>
                          <p className={`font-serif italic text-lg leading-relaxed ${theme.textPrimary}`}>
                              "Do not spoil what you have by desiring what you have not."
                          </p>
                          <p className={`text-xs font-sans font-bold uppercase mt-2 tracking-wide ${theme.textSecondary}`}>— Epicurus</p>
                      </div>
                  </div>
              )}

              {/* DAY STRIP */}
              {viewMode === 'routine' && (
                  <div className={`flex justify-between items-center border-b pb-6 md:pb-8 overflow-x-auto no-scrollbar gap-3 mask-linear-fade animate-fade-in-up ${theme.border}`}>
                      {weekDays.map((dayObj) => {
                          const isSelected = activeDate === dayObj.date;
                          return (
                          <button 
                              key={dayObj.date}
                              onClick={() => setActiveDate(dayObj.date)}
                              className={`flex flex-col items-center justify-center w-14 h-20 md:w-16 md:h-24 rounded-2xl transition-all shrink-0 relative ${
                                  isSelected
                                  ? `${theme.buttonPrimary} shadow-lg scale-105 transform -translate-y-1` 
                                  : `${theme.cardBg} border ${theme.border} ${theme.textSecondary} hover:border-current`
                              }`}
                          >
                              <span className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider mb-1">
                                  {dayObj.name.substring(0, 3)}
                              </span>
                              <span className="text-lg md:text-2xl font-serif">{dayObj.num}</span>
                              {dayObj.isToday && !isSelected && (
                                  <div className={`w-1 h-1 rounded-full absolute bottom-3 ${theme.accentBg}`}></div>
                              )}
                          </button>
                      )})}
                  </div>
              )}
          </div>

          {/* CONTENT AREA */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 md:px-12 pb-12 scroll-smooth no-scrollbar">
              {viewMode === 'routine' ? renderRoutineView() : renderCalendarView()}

              <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className={`w-full py-4 md:py-5 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-all font-sans text-xs font-bold uppercase tracking-wide group mb-12 ${theme.borderDashed} ${theme.textSecondary} hover:border-current hover:text-current`}
              >
                  <Plus size={16} className="group-hover:scale-110 transition-transform"/> Add Routine
              </button>

              {/* FOOTER */}
              <div className={`rounded-3xl p-6 md:p-8 border mb-6 ${theme.footerBg} ${theme.border}`}>
                  {/* Weather/Mood */}
                  <div className={`flex flex-col gap-6 mb-8 border-b border-dashed pb-6 ${theme.borderDashed}`}>
                      <h3 className={`font-sans text-xs font-bold uppercase ${theme.textSecondary}`}>Daily Mood</h3>
                      <div className="flex justify-between sm:justify-start sm:gap-4">
                          {[
                              {id: 'sun', icon: <Sun size={20}/>}, 
                              {id: 'cloud', icon: <Cloud size={20}/>}, 
                              {id: 'rain', icon: <Wind size={20}/>}
                          ].map((m) => (
                              <button 
                                  key={m.id}
                                  onClick={() => updateDailyLog('mood', m.id)}
                                  className={`transition-all p-3 rounded-xl border ${
                                      dailyLog.mood === m.id 
                                      ? `${theme.cardBg} ${theme.border} ${theme.textPrimary} shadow-sm` 
                                      : `${theme.textMuted} border-transparent hover:bg-black/5`
                                  }`}
                              >
                                  {m.icon}
                              </button>
                          ))}
                      </div>
                  </div>
                  {/* Gratitude */}
                  <div>
                      <h3 className={`font-sans text-xs font-bold uppercase mb-3 ${theme.textSecondary}`}>Gratitude</h3>
                      <div className="relative">
                          <input 
                              type="text"
                              value={dailyLog.gratitude || ''}
                              onChange={(e) => updateDailyLog('gratitude', e.target.value)}
                              className={`w-full rounded-xl border text-base py-3 px-4 focus:outline-none placeholder:opacity-50 transition-colors shadow-sm ${theme.cardBg} ${theme.border} ${theme.textPrimary}`}
                              placeholder=" "
                          />
                          {(!dailyLog.gratitude) && (
                              <span className={`absolute top-3.5 left-4 pointer-events-none font-serif italic text-sm ${theme.textMuted}`}>
                                  One small thing...
                              </span>
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* --- MODALS --- */}
          <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Entry" theme={theme}>
              <AddHabitForm onSubmit={handleAddHabit} onCancel={() => setIsAddModalOpen(false)} theme={theme} />
          </Modal>

          <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="My Focus" theme={theme}>
              <div className="space-y-6">
                  <div>
                      <label className={`block font-sans text-xs font-bold uppercase mb-2 ${theme.textSecondary}`}>Weekly Intention</label>
                      <textarea className={`w-full border rounded-xl p-4 font-serif focus:outline-none ${theme.inputBg} ${theme.border} ${theme.textPrimary}`} rows={3} defaultValue="Focus on sleep quality and staying hydrated." />
                  </div>
              </div>
          </Modal>

          {/* Toast */}
          <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 z-[60] ${theme.buttonPrimary} ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
              <Check size={14} /> <span className="text-sm font-sans font-medium">{toast.message}</span>
          </div>

        </div>
      </div>
    </>
  );
};

// --- SUB-COMPONENTS ---

const HabitCalendarCard = ({ habit, activeDate, onToggleHistory, theme }) => {
    // history is 14 items. Index 13 = activeDate.
    const history = habit.history || Array(14).fill(0);
    const last7Days = history.slice(-7); // Get last 7 days ending on activeDate
    
    // Calculate streak based on full history provided (14 days)
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
        if (history[i] === 1) streak++;
        else break;
    }

    // Helper to get letter for day (M, T, W...)
    const getDayLetter = (offsetFromActive) => {
        const d = new Date(activeDate);
        d.setDate(d.getDate() - offsetFromActive);
        return d.toLocaleDateString('en-US', { weekday: 'narrow' });
    };

    return (
        <div className={`p-5 rounded-3xl border hover:shadow-sm transition-all duration-300 flex flex-col md:flex-row gap-6 md:items-center ${theme.cardBg} ${theme.border} ${theme.cardHover}`}>
            <div className="flex items-center gap-4 min-w-[200px]">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${streak > 0 ? `${theme.accentBg} ${theme.accentText}` : `${theme.inputBg} ${theme.textMuted}`}`}>
                    <HabitIcon name={habit.icon} size={22} />
                </div>
                <div>
                    <h3 className={`text-lg font-medium ${theme.textPrimary}`}>{habit.title}</h3>
                    <div className={`flex items-center gap-2 text-xs font-sans font-bold uppercase ${theme.textSecondary}`}>
                        <span>{habit.routineType}</span>
                        <span className={`w-1 h-1 rounded-full ${theme.textSecondary} bg-current`}></span>
                        <span className={streak > 0 ? theme.textPrimary : ''}>{streak} Day Streak</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto no-scrollbar">
                <div className="flex gap-2 min-w-max pb-1 justify-between md:justify-end">
                    {last7Days.map((val, i) => {
                        // i=0 (oldest of the 7) ... i=6 (activeDate)
                        // In history array, i=6 corresponds to history[13]
                        // History index needed for toggle: history.length - 7 + i
                        // Or simplify: The history array passed is 14 long. 
                        // We are displaying indices 7 to 13.
                        // So correct index to toggle = 7 + i.
                        const historyIndex = 7 + i;
                        
                        // Calculate Date Number to display
                        const daysAgo = 6 - i; // 6 days ago ... 0 days ago
                        const d = new Date(activeDate);
                        d.setDate(d.getDate() - daysAgo);
                        const dateNum = d.getDate();
                        const isToday = formatDate(d) === formatDate(new Date());

                        return (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <span className={`text-[9px] font-sans font-bold ${theme.textMuted}`}>{getDayLetter(daysAgo)}</span>
                                <button 
                                    onClick={() => onToggleHistory(historyIndex)}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-serif transition-all duration-200 ${
                                        val 
                                        ? `${theme.buttonPrimary} shadow-sm` 
                                        : isToday 
                                            ? `border-2 ${theme.border} ${theme.textPrimary}` 
                                            : `${theme.inputBg} ${theme.textMuted} hover:bg-black/5`
                                    }`}
                                >
                                    {dateNum}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Generic Modal (Unchanged logic, just ensure theme prop is passed)
const Modal = ({ isOpen, onClose, title, children, theme }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className={`relative w-full max-w-lg rounded-[2rem] shadow-2xl border animate-fade-in-up flex flex-col max-h-[90vh] md:max-h-[85vh] ${theme.containerBg} ${theme.border}`}>
                <div className={`flex justify-between items-center p-6 md:p-8 pb-4 border-b shrink-0 ${theme.border}`}>
                    <h2 className={`text-xl md:text-2xl font-serif italic ${theme.textPrimary}`}>{title}</h2>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme.textSecondary} hover:bg-black/5`}>
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 md:p-8 overflow-y-auto no-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Add Habit Form
const AddHabitForm = ({ onSubmit, onCancel, theme }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [isTimeMode, setIsTimeMode] = useState(true); 
    const [period, setPeriod] = useState('morning');
    const [routineType, setRoutineType] = useState('Daily');
    const [icon, setIcon] = useState('sun');

    // Mappers
    const periods = [{ id: 'morning', label: 'Morning' }, { id: 'afternoon', label: 'Afternoon' }, { id: 'evening', label: 'Evening' }];
    const icons = [{ id: 'sun' }, { id: 'moon' }, { id: 'book' }, { id: 'coffee' }, { id: 'drop' }, { id: 'leaf' }];

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!title) return;
        onSubmit({ 
            title, 
            description, 
            time: time || (isTimeMode ? "09:00" : "30 mins"), 
            isTimeMode, 
            period, 
            routineType, 
            icon 
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className={`flex items-center gap-2 font-sans text-xs font-bold uppercase mb-2 ${theme.textSecondary}`}><Tag size={12} /> Routine Name</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Read 10 Pages" className={`w-full border rounded-xl px-4 py-3 font-serif focus:outline-none ${theme.inputBg} ${theme.border} ${theme.textPrimary}`} autoFocus />
            </div>
            <div>
                <label className={`flex items-center gap-2 font-sans text-xs font-bold uppercase mb-2 ${theme.textSecondary}`}><AlignLeft size={12} /> Notes</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Details..." rows={2} className={`w-full border rounded-xl px-4 py-3 font-serif text-sm focus:outline-none resize-none ${theme.inputBg} ${theme.border} ${theme.textPrimary}`} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className={`block font-sans text-xs font-bold uppercase mb-2 ${theme.textSecondary}`}>Time of Day</label>
                    <select value={period} onChange={e => setPeriod(e.target.value)} className={`w-full border rounded-xl px-4 py-3 font-serif text-sm focus:outline-none ${theme.inputBg} ${theme.border} ${theme.textPrimary}`}>
                        {periods.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                </div>
                 <div>
                    <label className={`block font-sans text-xs font-bold uppercase mb-2 ${theme.textSecondary}`}>Icon</label>
                    <div className="flex gap-2">
                        {icons.slice(0, 3).map(i => (
                            <button type="button" key={i.id} onClick={() => setIcon(i.id)} className={`flex-1 h-10 rounded-lg flex items-center justify-center border transition-all ${icon === i.id ? `${theme.buttonPrimary}` : `${theme.border}`}`}>
                                <HabitIcon name={i.id} size={16} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-6 flex gap-4 mt-auto">
                <button type="button" onClick={onCancel} className={`flex-1 py-3 rounded-xl border font-sans text-sm font-bold ${theme.border} ${theme.textSecondary} hover:bg-black/5`}>Cancel</button>
                <button type="submit" className={`flex-1 py-3 rounded-xl font-sans text-sm font-bold hover:opacity-90 shadow-lg ${theme.buttonPrimary}`}>Save Routine</button>
            </div>
        </form>
    );
};

const HabitIcon = ({ name, size }) => {
    switch(name) {
        case 'sun': return <Sun size={size} />;
        case 'moon': return <Moon size={size} />;
        case 'book': return <BookOpen size={size} />;
        case 'coffee': return <Coffee size={size} />;
        case 'drop': return <Droplets size={size} />;
        default: return <Leaf size={size} />;
    }
};

const HabitCard = ({ habit, expanded, onExpand, onComplete, onSkip, onDelete, onUpdateNote, theme }) => {
    const isSkipped = habit.status === 'skipped';
    const isCompleted = habit.status === 'completed';
    const displayTime = habit.time; 
    
    // Local state for note to avoid jitter, parent handles debounce save
    const [noteText, setNoteText] = useState(habit.note || '');

    // Sync noteText if habit prop changes externally (e.g. fresh fetch)
    useEffect(() => {
        setNoteText(habit.note || '');
    }, [habit.note]);

    const handleNoteChange = (e) => {
        setNoteText(e.target.value);
        onUpdateNote(e.target.value);
    };

    return (
        <div 
            onClick={onExpand}
            className={`group relative p-5 md:p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                isCompleted 
                ? 'bg-[#EFF1EE] dark:bg-[#232622] border-[#E0E2DF] dark:border-[#363a34] shadow-inner' // "Pressed" paper look
                : isSkipped 
                    ? `bg-transparent border border-dashed ${theme.border} opacity-60`
                    : `${theme.cardBg} ${theme.border} ${theme.cardHover} shadow-sm hover:-translate-y-1`
            }`}
        >
            <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted 
                            ? 'bg-[#DCE3DA] text-[#6B7C68]' // Muted Sage Icon Bg
                            : `${theme.inputBg} ${theme.textSecondary}`
                    }`}>
                        <HabitIcon name={habit.icon} size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className={`text-lg md:text-xl transition-colors font-medium truncate ${
                            isCompleted 
                                ? 'text-[#8A9A85] line-through decoration-[#8A9A85]/50' // Sage text with strikethrough
                                : theme.textPrimary
                        }`}>
                            {habit.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded whitespace-nowrap ${theme.inputBg} ${theme.textSecondary}`}>
                                {habit.routineType || 'Daily'}
                            </span>
                            <span className={`text-xs font-sans uppercase tracking-wide truncate ${theme.textSecondary}`}>
                                {isSkipped ? 'Rest Day' : displayTime}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 ml-2 shrink-0">
                    <button 
                        className={`p-2 rounded-full transition-all ${isSkipped ? theme.textSecondary : `${theme.textMuted} hover:text-current opacity-0 group-hover:opacity-100`}`}
                        onClick={(e) => { e.stopPropagation(); onSkip(); }}
                        title="Rest Day"
                    >
                        <Leaf size={18} />
                    </button>
                    <div 
                        onClick={(e) => { e.stopPropagation(); onComplete(); }}
                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                        ? 'bg-[#8A9A85] border-[#8A9A85] text-white scale-105 shadow-sm' // Solid Sage Button
                        : `border-[#E6E4DC] dark:border-[#363a34] text-transparent group-hover:border-[#8A9A85] group-hover:text-[#8A9A85]/30`
                    }`}>
                        {isCompleted && <Check size={16} strokeWidth={3} />}
                    </div>
                </div>
            </div>

            {/* Details Drawer */}
            <div 
                className={`transition-all duration-500 ease-in-out cursor-default ${expanded ? 'max-h-60 opacity-100 mt-5' : 'max-h-0 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                 {habit.description && (
                     <div className={`mb-3 px-1 text-sm font-serif italic ${theme.textSecondary}`}>"{habit.description}"</div>
                 )}
                 <textarea 
                    value={noteText}
                    onChange={handleNoteChange}
                    placeholder="Add a daily note..." 
                    className={`w-full rounded-xl text-sm placeholder:opacity-50 font-sans focus:outline-none resize-none p-3 mb-3 border border-transparent focus:border-current transition-colors ${theme.inputBg} ${theme.textPrimary}`} 
                    rows={2} 
                 />
                <div className="flex justify-end">
                    <button onClick={onDelete} className={`flex items-center gap-2 text-[10px] font-sans font-bold uppercase hover:text-red-400 transition-colors px-2 py-1 ${theme.textMuted}`}>
                        <Trash2 size={12} /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardBotanical;