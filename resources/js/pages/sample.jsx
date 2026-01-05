import React, { useState } from 'react';
import { 
  BookOpen, 
  Coffee, 
  Sun, 
  Moon, 
  Leaf,
  Plus, 
  Check, 
  X,
  Trash2,
  Settings,
  Droplets,
  Wind,
  Clock,
  Tag,
  Calendar,
  AlignLeft,
  Timer,
  Cloud
} from 'lucide-react';

// --- MAIN COMPONENT ---
const DashboardBotanical = () => {
  const [activeDay, setActiveDay] = useState(24);
  const [expandedHabit, setExpandedHabit] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [gratitude, setGratitude] = useState('');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Mock Data
  const [habits, setHabits] = useState([
    { id: 1, title: "Morning Yoga", period: "morning", routineType: "Daily", time: "07:00", isTimeMode: true, status: "completed", note: "Felt stiff today.", icon: "sun" },
    { id: 2, title: "Hydrate", period: "morning", routineType: "Daily", time: "500ml", isTimeMode: false, status: "pending", note: "", icon: "drop" },
    { id: 3, title: "Deep Work", period: "afternoon", routineType: "Daily", time: "2 Hours", isTimeMode: false, status: "skipped", note: "Headache, took a break.", icon: "book" },
    { id: 4, title: "Matcha Break", period: "afternoon", routineType: "Daily", time: "15:00", isTimeMode: true, status: "pending", note: "", icon: "coffee" },
    { id: 5, title: "Skincare", period: "evening", routineType: "Daily", time: "20 min", isTimeMode: false, status: "pending", note: "", icon: "moon" },
  ]);

  // --- ACTIONS ---

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const toggleComplete = (id) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const newStatus = h.status === 'completed' ? 'pending' : 'completed';
        if (newStatus === 'completed') showToast("Routine completed.");
        return { ...h, status: newStatus };
      }
      return h;
    }));
  };

  const toggleSkip = (id) => {
    setHabits(habits.map(h => {
        if (h.id === id) {
          return { ...h, status: h.status === 'skipped' ? 'pending' : 'skipped' };
        }
        return h;
    }));
  };

  const deleteHabit = (id) => {
      setHabits(habits.filter(h => h.id !== id));
      showToast("Routine removed.");
  };

  const toggleExpand = (id) => {
    setExpandedHabit(expandedHabit === id ? null : id);
  };

  const handleAddHabit = (newHabit) => {
      setHabits([...habits, { ...newHabit, id: Date.now(), status: 'pending', note: '' }]);
      setIsAddModalOpen(false);
      showToast("New routine added.");
  };

  const calculateProgress = () => {
      if (habits.length === 0) return 0;
      const completed = habits.filter(h => h.status === 'completed').length;
      return Math.round((completed / habits.length) * 100);
  };

  // --- RENDER HELPERS ---

  const renderSection = (title, periodKey) => {
    const periodHabits = habits.filter(h => h.period === periodKey);
    
    return (
      <div className="mb-8 md:mb-10">
        <h3 className="font-sans text-xs font-bold uppercase text-[#9C9C9C] mb-4 flex items-center gap-2">
            {title} <div className="h-px bg-[#E6E4DC] flex-1"></div>
        </h3>
        <div className="space-y-4">
            {periodHabits.length > 0 ? (
                periodHabits.map(habit => (
                <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    expanded={expandedHabit === habit.id}
                    onExpand={() => toggleExpand(habit.id)}
                    onComplete={() => toggleComplete(habit.id)}
                    onSkip={() => toggleSkip(habit.id)}
                    onDelete={() => deleteHabit(habit.id)}
                /> 
                ))
            ) : (
                <div className="text-center p-6 border border-dashed border-[#E6E4DC] rounded-2xl text-[#B0B0B0] text-sm italic bg-[#FBFBF9]">
                    No routines for this time yet.
                </div>
            )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9] text-[#4A4A4A] font-serif p-2 sm:p-4 md:p-8 selection:bg-[#DCE3DA]">
      
      {/* Main Container "Notebook" */}
      <div className="w-full max-w-3xl mx-auto bg-[#FDFCF8] min-h-[85vh] md:min-h-[90vh] rounded-3xl md:rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-[#E6E4DC] relative overflow-hidden flex flex-col transition-all duration-300">
        
        {/* Subtle Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        {/* HEADER */}
        <div className="relative z-10 p-6 md:p-12 pb-4 md:pb-6">
            <div className="flex justify-between items-start mb-6 md:mb-8">
                <div>
                    <span className="block text-xs md:text-sm font-sans tracking-widest uppercase text-[#9C9C9C] mb-1">Daily Log</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl text-[#2C3628] leading-tight">October {activeDay}</h1>
                </div>
                {/* Settings / Progress Trigger */}
                <button 
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#E6E4DC] flex items-center justify-center bg-white shadow-sm hover:border-[#DCE3DA] hover:scale-105 transition-all group shrink-0"
                >
                   <span className="font-sans font-bold text-[#2C3628] text-xs md:text-sm group-hover:hidden">{calculateProgress()}%</span>
                   <Settings size={20} className="hidden group-hover:block text-[#9C9C9C]" />
                </button>
            </div>

            {/* Week Strip */}
            <div className="flex justify-between items-center border-b border-[#E6E4DC] pb-6 md:pb-8 overflow-x-auto no-scrollbar gap-2 mask-linear-fade">
                {[22, 23, 24, 25, 26, 27, 28].map((day) => (
                    <button 
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className={`flex flex-col items-center justify-center w-12 h-16 md:w-14 md:h-20 rounded-2xl transition-all shrink-0 ${
                            activeDay === day 
                            ? 'bg-[#2C3628] text-[#FDFCF8] shadow-md scale-105' 
                            : 'bg-white border border-[#E6E4DC] text-[#9C9C9C] hover:border-[#DCE3DA]'
                        }`}
                    >
                        <span className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider mb-1">Oct</span>
                        <span className="text-lg md:text-xl font-serif">{day}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* CONTENT AREA */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 md:px-12 pb-12 scroll-smooth">
            {renderSection("Morning Ritual", "morning")}
            {renderSection("Afternoon Focus", "afternoon")}
            {renderSection("Evening Wind Down", "evening")}

            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-full py-4 md:py-5 rounded-2xl border-2 border-dashed border-[#E6E4DC] text-[#9C9C9C] flex items-center justify-center gap-2 hover:bg-[#F2F0E9] hover:border-[#DCE3DA] hover:text-[#8A9A85] transition-all font-sans text-xs font-bold uppercase tracking-wide group mb-12"
            >
                <Plus size={16} className="group-hover:scale-110 transition-transform"/> Add Routine
            </button>

            {/* FOOTER */}
            <div className="bg-[#F8F7F2] rounded-3xl p-6 md:p-8 border border-[#E6E4DC]/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#E6E4DC] border-dashed pb-6">
                    <h3 className="font-sans text-xs font-bold uppercase text-[#9C9C9C]">Daily Weather</h3>
                    <div className="flex gap-4">
                        {[
                            {id: 'sun', icon: <Sun size={20}/>}, 
                            {id: 'cloud', icon: <Cloud size={20}/>}, 
                            {id: 'rain', icon: <Wind size={20}/>}
                        ].map((m) => (
                            <button 
                                key={m.id}
                                onClick={() => setSelectedMood(m.id)}
                                className={`transition-all p-2 rounded-full hover:bg-[#E6E4DC]/30 ${
                                    selectedMood === m.id ? 'text-[#2C3628] scale-110' : 'text-[#D1D1D1] hover:text-[#8A9A85]'
                                }`}
                            >
                                {m.icon}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-sans text-xs font-bold uppercase text-[#9C9C9C] mb-2">Gratitude Footnote</h3>
                    <input 
                        type="text"
                        value={gratitude}
                        onChange={(e) => setGratitude(e.target.value)}
                        placeholder="One small thing I'm grateful for..."
                        className="w-full bg-transparent border-b border-[#E6E4DC] text-[#4A4A4A] font-serif text-base md:text-lg py-2 focus:outline-none focus:border-[#8A9A85] placeholder:text-[#D1D1D1] transition-colors"
                    />
                </div>
            </div>
        </div>

        {/* --- MODALS --- */}
        
        {/* 1. ADD HABIT MODAL */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="New Entry">
            <AddHabitForm onSubmit={handleAddHabit} onCancel={() => setIsAddModalOpen(false)} />
        </Modal>

        {/* 2. SETTINGS MODAL */}
        <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="My Focus">
            <div className="space-y-6">
                <div>
                    <label className="block font-sans text-xs font-bold uppercase text-[#9C9C9C] mb-2">Weekly Intention</label>
                    <textarea 
                        className="w-full bg-[#F8F7F2] border border-[#E6E4DC] rounded-xl p-4 text-[#4A4A4A] font-serif focus:outline-none focus:border-[#DCE3DA]"
                        rows={3}
                        defaultValue="Focus on sleep quality and staying hydrated."
                    />
                </div>
                <div className="pt-4 border-t border-[#E6E4DC]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[#4A4A4A] font-serif">Notifications</span>
                        <div className="w-10 h-6 bg-[#DCE3DA] rounded-full relative cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-5 shadow-sm"></div>
                        </div>
                    </div>
                    <p className="text-xs text-[#9C9C9C]">Gentle reminders at morning and evening.</p>
                </div>
            </div>
        </Modal>

        {/* 3. TOAST NOTIFICATION */}
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#2C3628] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 z-[60] ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
            <Check size={14} /> <span className="text-sm font-sans font-medium">{toast.message}</span>
        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

// 1. Generic Modal Wrapper (Responsive Fixes)
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-[#2C3628]/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-[#FDFCF8] w-full max-w-lg rounded-[2rem] shadow-2xl border border-[#E6E4DC] animate-fade-in-up flex flex-col max-h-[90vh] md:max-h-[85vh]">
                <div className="flex justify-between items-center p-6 md:p-8 pb-4 border-b border-[#E6E4DC] shrink-0">
                    <h2 className="text-xl md:text-2xl text-[#2C3628] font-serif italic">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-[#F2F0E9] rounded-full text-[#9C9C9C] transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

// 2. Enhanced Add Habit Form
const AddHabitForm = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [isTimeMode, setIsTimeMode] = useState(true); // true = Clock time, false = Duration
    const [period, setPeriod] = useState('morning');
    const [routineType, setRoutineType] = useState('Daily');
    const [icon, setIcon] = useState('sun');

    const periods = [
        { id: 'morning', label: 'Morning' },
        { id: 'afternoon', label: 'Afternoon' },
        { id: 'evening', label: 'Evening' }
    ];

    const routineTypes = ['Daily', 'Weekly', 'One-time'];
    const icons = [
        { id: 'sun', label: 'Morning' },
        { id: 'moon', label: 'Night' },
        { id: 'book', label: 'Study' },
        { id: 'coffee', label: 'Break' },
        { id: 'drop', label: 'Health' },
        { id: 'leaf', label: 'Nature' }
    ];

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
            
            {/* 1. Name */}
            <div>
                <label className="flex items-center gap-2 font-sans text-xs font-bold uppercase text-[#9C9C9C] mb-2">
                    <Tag size={12} /> Routine Name
                </label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Read 10 Pages"
                    className="w-full bg-[#F8F7F2] border border-[#E6E4DC] rounded-xl px-4 py-3 font-serif text-[#4A4A4A] focus:outline-none focus:border-[#8A9A85] focus:bg-white transition-colors"
                    autoFocus
                />
            </div>

            {/* 2. Description */}
            <div>
                <label className="flex items-center gap-2 font-sans text-xs font-bold uppercase text-[#9C9C9C] mb-2">
                    <AlignLeft size={12} /> Notes (Optional)
                </label>
                <textarea 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Add details about this habit..."
                    rows={2}
                    className="w-full bg-[#F8F7F2] border border-[#E6E4DC] rounded-xl px-4 py-3 font-serif text-[#4A4A4A] text-sm focus:outline-none focus:border-[#8A9A85] focus:bg-white transition-colors resize-none"
                />
            </div>

            {/* 3. Routine Type */}
            <div>
                <label className="flex items-center gap-2 font-sans text-xs font-bold uppercase text-[#9C9C9C] mb-3">
                    <Calendar size={12} /> Frequency
                </label>
                <div className="flex gap-2">
                    {routineTypes.map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setRoutineType(type)}
                            className={`flex-1 py-2 rounded-lg text-sm font-sans font-bold transition-all border ${
                                routineType === type
                                ? 'bg-[#DCE3DA] border-[#DCE3DA] text-[#2C3628] shadow-sm' 
                                : 'bg-transparent border-[#E6E4DC] text-[#9C9C9C] hover:border-[#DCE3DA]'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Time / Goal (Responsive Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                     <div className="flex justify-between items-end mb-2">
                        <label className="flex items-center gap-2 font-sans text-xs font-bold uppercase text-[#9C9C9C]">
                            {isTimeMode ? <Clock size={12} /> : <Timer size={12} />} {isTimeMode ? "At Time" : "Duration"}
                        </label>
                        <button 
                            type="button" 
                            onClick={() => setIsTimeMode(!isTimeMode)}
                            className="text-[10px] uppercase font-bold text-[#8A9A85] hover:underline"
                        >
                            Switch to {isTimeMode ? "Duration" : "Time"}
                        </button>
                     </div>
                     
                     {isTimeMode ? (
                         <input 
                            type="time" 
                            value={time} 
                            onChange={e => setTime(e.target.value)}
                            className="w-full bg-[#F8F7F2] border border-[#E6E4DC] rounded-xl px-4 py-3 font-serif text-[#4A4A4A] focus:outline-none focus:border-[#8A9A85] focus:bg-white transition-colors"
                        />
                     ) : (
                        <input 
                            type="text" 
                            value={time} 
                            onChange={e => setTime(e.target.value)}
                            placeholder="e.g. 30 mins"
                            className="w-full bg-[#F8F7F2] border border-[#E6E4DC] rounded-xl px-4 py-3 font-serif text-[#4A4A4A] focus:outline-none focus:border-[#8A9A85] focus:bg-white transition-colors"
                        />
                     )}
                </div>

                {/* 5. Period Select */}
                <div>
                    <label className="block font-sans text-xs font-bold uppercase text-[#9C9C9C] mb-3 mt-1 sm:mt-0">Time of Day</label>
                    <div className="flex gap-2">
                        {periods.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setPeriod(p.id)}
                                className={`flex-1 py-2 sm:py-3 rounded-lg text-sm font-sans font-bold transition-all border ${
                                    period === p.id 
                                    ? 'bg-[#DCE3DA] border-[#DCE3DA] text-[#2C3628] shadow-sm' 
                                    : 'bg-transparent border-[#E6E4DC] text-[#9C9C9C] hover:border-[#DCE3DA]'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Icon Grid */}
            <div>
                <label className="block font-sans text-xs font-bold uppercase text-[#9C9C9C] mb-3">Symbol</label>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">
                    {icons.map(ic => (
                        <button 
                            key={ic.id}
                            type="button"
                            onClick={() => setIcon(ic.id)}
                            title={ic.label} 
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all ${
                                icon === ic.id
                                ? 'bg-[#2C3628] border-[#2C3628] text-white scale-110 shadow-md' 
                                : 'border-[#E6E4DC] text-[#9C9C9C] hover:border-[#DCE3DA] bg-white'
                            }`}
                        >
                            <HabitIcon name={ic.id} size={20} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-6 flex gap-4 mt-auto">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="flex-1 py-3 rounded-xl border border-[#E6E4DC] text-[#9C9C9C] font-sans text-sm font-bold hover:bg-[#F2F0E9] hover:text-[#4A4A4A] transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="flex-1 py-3 rounded-xl bg-[#2C3628] text-white font-sans text-sm font-bold hover:opacity-90 shadow-lg shadow-[#2C3628]/20 transition-all transform hover:-translate-y-0.5"
                >
                    Save Routine
                </button>
            </div>
        </form>
    );
};

// 3. Icon Mapper Helper
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

// 4. Habit Card
const HabitCard = ({ habit, expanded, onExpand, onComplete, onSkip, onDelete }) => {
    const isSkipped = habit.status === 'skipped';
    const isCompleted = habit.status === 'completed';
    const displayTime = habit.time; 

    return (
        <div 
            onClick={onExpand}
            className={`group relative p-5 md:p-6 rounded-2xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                isCompleted 
                ? 'bg-[#F4F6F4] border-transparent' 
                : isSkipped 
                    ? 'bg-transparent border border-dashed border-[#E6E4DC] opacity-60'
                    : 'bg-white border-[#E6E4DC] hover:border-[#DCE3DA] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1'
            }`}
        >
            <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isCompleted ? 'bg-[#DCE3DA] text-[#2C3628]' : 'bg-[#F2F0E9] text-[#9C9C9C]'
                    }`}>
                        <HabitIcon name={habit.icon} size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className={`text-lg md:text-xl transition-colors font-medium truncate ${
                            isCompleted ? 'text-[#8A9A85] line-through decoration-[#8A9A85]' : 
                            isSkipped ? 'text-[#9C9C9C] italic' : 'text-[#2C3628]'
                        }`}>
                            {habit.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-wider bg-[#F2F0E9] px-2 py-0.5 rounded text-[#9C9C9C] whitespace-nowrap">
                                {habit.routineType || 'Daily'}
                            </span>
                            <span className="text-xs font-sans text-[#9C9C9C] uppercase tracking-wide truncate">
                                {isSkipped ? 'Rest Day' : displayTime}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 ml-2 shrink-0">
                    {/* The "Rest/Skip" Button */}
                    <button 
                        className={`p-2 rounded-full transition-all ${isSkipped ? 'text-[#8A9A85] bg-[#F2F0E9]' : 'text-[#D1D1D1] hover:text-[#8A9A85] opacity-0 group-hover:opacity-100'}`}
                        onClick={(e) => { e.stopPropagation(); onSkip(); }}
                        title="Rest Day"
                    >
                        <Leaf size={18} />
                    </button>

                    {/* Checkbox */}
                    <div 
                        onClick={(e) => { e.stopPropagation(); onComplete(); }}
                        className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isCompleted 
                        ? 'bg-[#8A9A85] border-[#8A9A85] text-white' 
                        : isSkipped
                            ? 'border-transparent text-transparent'
                            : 'border-[#E6E4DC] text-transparent group-hover:border-[#DCE3DA]'
                    }`}>
                        {isCompleted && <Check size={16} />}
                    </div>
                </div>
            </div>

            {/* Details Drawer */}
            <div 
                className={`transition-all duration-500 ease-in-out ${expanded ? 'max-h-60 opacity-100 mt-5' : 'max-h-0 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                 {habit.description && (
                     <div className="mb-3 px-1 text-sm text-[#8A9A85] font-serif italic">
                         "{habit.description}"
                     </div>
                 )}
                 <textarea 
                    placeholder="Add a daily note..." 
                    className="w-full bg-[#F9F8F6] rounded-xl text-sm text-[#4A4A4A] placeholder-[#B0B0B0] font-sans focus:outline-none resize-none p-3 mb-3 border border-transparent focus:border-[#DCE3DA] transition-colors"
                    rows={2}
                    defaultValue={habit.note}
                />
                <div className="flex justify-end">
                    <button 
                        onClick={onDelete}
                        className="flex items-center gap-2 text-[10px] font-sans font-bold uppercase text-[#D1D1D1] hover:text-red-400 transition-colors px-2 py-1"
                    >
                        <Trash2 size={12} /> Remove
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardBotanical;