import React from 'react';
import { ChevronLeft, ChevronRight, Flower, Sparkles } from 'lucide-react';

interface CalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  tasksByDate: Record<string, any[]>;
}

const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  tasksByDate
}) => {
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: number) => {
    const newDate = new Date(year, month + direction, 1);
    onMonthChange(newDate);
  };

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const hasTasksOnDate = (day: number) => {
    const date = new Date(year, month, day);
    const dateKey = getDateKey(date);
    return tasksByDate[dateKey] && tasksByDate[dateKey].length > 0;
  };

  const getTaskCount = (day: number) => {
    const date = new Date(year, month, day);
    const dateKey = getDateKey(date);
    return tasksByDate[dateKey]?.length || 0;
  };

  const isToday = (day: number) => {
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const isSelected = (day: number) => {
    return selectedDate.getFullYear() === year && 
           selectedDate.getMonth() === month && 
           selectedDate.getDate() === day;
  };

  const renderCalendarDays = () => {
    const days = [];
    
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-12 sm:h-16"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hasTasks = hasTasksOnDate(day);
      const taskCount = getTaskCount(day);
      const todayClass = isToday(day);
      const selectedClass = isSelected(day);

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`
            h-12 sm:h-16 w-full rounded-xl sm:rounded-2xl font-semibold transition-all duration-500 
            hover:scale-110 hover:shadow-2xl relative group overflow-hidden
            transform hover:-translate-y-1 active:scale-95 text-sm sm:text-base
            ${selectedClass 
              ? 'bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500 text-white shadow-2xl scale-110 animate-glow' 
              : todayClass
              ? 'bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 text-white shadow-xl animate-pulse-gentle'
              : 'hover:bg-gradient-to-br hover:from-emerald-100 hover:via-teal-50 hover:to-cyan-100 text-gray-700 hover:text-emerald-700'
            }
          `}
        >
          <span className="relative z-10">{day}</span>
          
          {hasTasks && (
            <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 z-20 flex items-center gap-1">
              <Flower size={10} className="text-yellow-400 animate-bounce sm:w-3.5 sm:h-3.5" />
              {taskCount > 1 && (
                <span className="text-xs bg-yellow-400 text-yellow-900 rounded-full w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center font-bold animate-pulse text-[8px] sm:text-xs">
                  {taskCount}
                </span>
              )}
            </div>
          )}
          
          {selectedClass && (
            <div className="absolute inset-0 bg-gradient-to-br from-rose-300/30 to-purple-300/30 rounded-xl sm:rounded-2xl animate-pulse"></div>
          )}
          
          {todayClass && !selectedClass && (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 to-cyan-300/20 rounded-xl sm:rounded-2xl animate-pulse"></div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/30 
                  hover:shadow-3xl transition-all duration-500 animate-fade-in">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-gradient-to-r hover:from-emerald-100 hover:to-cyan-100 
                   transition-all duration-500 hover:scale-125 active:scale-95 group hover:shadow-lg"
        >
          <ChevronLeft size={20} className="text-gray-600 group-hover:text-emerald-600 transition-colors duration-300 sm:w-6 sm:h-6" />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 
                       bg-clip-text text-transparent mb-1 animate-shimmer">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center justify-center gap-1">
            <Sparkles size={12} className="text-yellow-500 animate-twinkle sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Select a date to view tasks</span>
            <Sparkles size={12} className="text-yellow-500 animate-twinkle sm:w-4 sm:h-4" style={{animationDelay: '0.5s'}} />
          </div>
        </div>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-gradient-to-r hover:from-emerald-100 hover:to-cyan-100 
                   transition-all duration-500 hover:scale-125 active:scale-95 group hover:shadow-lg"
        >
          <ChevronRight size={20} className="text-gray-600 group-hover:text-cyan-600 transition-colors duration-300 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-3 sm:mb-4">
        {dayNames.map(day => (
          <div key={day} className="h-8 sm:h-10 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wider">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;