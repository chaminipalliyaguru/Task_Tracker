import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import TaskTracker from './components/TaskTracker';
import DayView from './components/DayView';
import MonthlyView from './components/MonthlyView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Calendar as CalendarIcon, Target, Sparkles, BarChart3, Flower2 } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isActive: boolean;
}

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'day' | 'monthly'>('calendar');
  const [tasksByDate, setTasksByDate] = useLocalStorage<Record<string, Task[]>>('tasksByDate', {});

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setView('day');
  };

  const handleTasksUpdate = (date: Date, tasks: Task[]) => {
    const dateKey = getDateKey(date);
    
    const tasksWithDates = tasks.map(task => ({
      ...task,
      startTime: typeof task.startTime === 'string' ? new Date(task.startTime) : task.startTime,
      endTime: task.endTime ? (typeof task.endTime === 'string' ? new Date(task.endTime) : task.endTime) : undefined
    }));

    setTasksByDate(prev => ({
      ...prev,
      [dateKey]: tasksWithDates
    }));
  };

  const getCurrentTasks = () => {
    const dateKey = getDateKey(selectedDate);
    const tasks = tasksByDate[dateKey] || [];
    
    return tasks.map(task => ({
      ...task,
      startTime: typeof task.startTime === 'string' ? new Date(task.startTime) : task.startTime,
      endTime: task.endTime ? (typeof task.endTime === 'string' ? new Date(task.endTime) : task.endTime) : undefined
    }));
  };

  useEffect(() => {
    const convertedTasks: Record<string, Task[]> = {};
    Object.entries(tasksByDate).forEach(([dateKey, tasks]) => {
      convertedTasks[dateKey] = tasks.map(task => ({
        ...task,
        startTime: typeof task.startTime === 'string' ? new Date(task.startTime) : task.startTime,
        endTime: task.endTime ? (typeof task.endTime === 'string' ? new Date(task.endTime) : task.endTime) : undefined
      }));
    });
    
    if (JSON.stringify(convertedTasks) !== JSON.stringify(tasksByDate)) {
      setTasksByDate(convertedTasks);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-sky-50 to-violet-100 
                    bg-[url('https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')] 
                    bg-cover bg-center bg-fixed relative overflow-hidden">
      
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-emerald-50/80 to-violet-50/70 backdrop-blur-[1px]"></div>
      
      {/* Floating Animated Elements - Hidden on mobile for performance */}
      <div className="hidden md:block absolute top-20 left-10 w-6 h-6 bg-pink-300/40 rounded-full animate-float"></div>
      <div className="hidden md:block absolute top-40 right-20 w-8 h-8 bg-purple-300/40 rounded-full animate-float-delayed"></div>
      <div className="hidden md:block absolute bottom-32 left-1/4 w-4 h-4 bg-green-300/40 rounded-full animate-float-slow"></div>
      <div className="hidden md:block absolute bottom-20 right-1/3 w-7 h-7 bg-blue-300/40 rounded-full animate-float-fast"></div>
      <div className="hidden md:block absolute top-1/2 left-20 w-5 h-5 bg-yellow-300/40 rounded-full animate-float"></div>
      <div className="hidden md:block absolute top-1/3 right-40 w-6 h-6 bg-rose-300/40 rounded-full animate-float-delayed"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 rounded-2xl sm:rounded-3xl shadow-2xl 
                          hover:scale-110 transition-all duration-500 hover:rotate-12 animate-pulse-gentle">
              <Target className="text-white" size={28} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 
                         bg-clip-text text-transparent animate-shimmer text-center">
              FlowerPark Tasks
            </h1>
            <Sparkles className="text-yellow-500 animate-twinkle" size={28} />
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium px-4">
            Track your daily journey in a peaceful, nature-inspired environment. 
            Watch your productivity bloom like flowers in a beautiful garden 🌸
          </p>
        </header>

        {/* Enhanced Navigation */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-2xl border border-white/30 
                        hover:shadow-3xl transition-all duration-500 w-full max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setView('calendar')}
                className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 
                          hover:scale-105 active:scale-95 text-sm sm:text-base ${
                  view === 'calendar'
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-white shadow-xl scale-105 animate-glow'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-cyan-100 hover:text-emerald-700'
                }`}
              >
                <CalendarIcon size={18} />
                <span className="hidden sm:inline">Calendar View</span>
                <span className="sm:hidden">Calendar</span>
              </button>
              <button
                onClick={() => setView('day')}
                className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 
                          hover:scale-105 active:scale-95 text-sm sm:text-base ${
                  view === 'day'
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-white shadow-xl scale-105 animate-glow'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-cyan-100 hover:text-emerald-700'
                }`}
              >
                <Target size={18} />
                <span className="hidden sm:inline">Day View</span>
                <span className="sm:hidden">Day</span>
              </button>
              <button
                onClick={() => setView('monthly')}
                className={`px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 
                          hover:scale-105 active:scale-95 text-sm sm:text-base ${
                  view === 'monthly'
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-white shadow-xl scale-105 animate-glow'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-cyan-100 hover:text-emerald-700'
                }`}
              >
                <BarChart3 size={18} />
                <span className="hidden sm:inline">Monthly View</span>
                <span className="sm:hidden">Monthly</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content with Enhanced Animations */}
        <div className="animate-slide-up">
          {view === 'calendar' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
              <div className="xl:col-span-2 order-2 xl:order-1">
                <Calendar
                  currentDate={currentDate}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  onMonthChange={setCurrentDate}
                  tasksByDate={tasksByDate}
                />
              </div>
              <div className="order-1 xl:order-2">
                <TaskTracker
                  selectedDate={selectedDate}
                  onTasksUpdate={handleTasksUpdate}
                  tasks={getCurrentTasks()}
                />
              </div>
            </div>
          )}

          {view === 'day' && (
            <div className="w-full">
              <DayView
                selectedDate={selectedDate}
                tasks={getCurrentTasks()}
              />
            </div>
          )}

          {view === 'monthly' && (
            <div className="w-full">
              <MonthlyView
                currentDate={currentDate}
                tasksByDate={tasksByDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <footer className="mt-12 sm:mt-20 text-center text-gray-600 animate-fade-in-delayed">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-pink-400 rounded-full animate-pulse-slow"></div>
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-emerald-400 rounded-full animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-cyan-400 rounded-full animate-pulse-slow" style={{animationDelay: '1s'}}></div>
            <Flower2 className="text-rose-400 animate-spin-slow" size={16} />
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-violet-400 rounded-full animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-yellow-400 rounded-full animate-pulse-slow" style={{animationDelay: '2s'}}></div>
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-indigo-400 rounded-full animate-pulse-slow" style={{animationDelay: '2.5s'}}></div>
          </div>
          <p className="text-base sm:text-lg font-medium px-4">
            Cultivating productivity in harmony with nature 🌸✨🌿
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;