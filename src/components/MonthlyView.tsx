import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Calendar, TrendingUp, Clock, Target, Flower2 } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isActive: boolean;
}

interface MonthlyViewProps {
  currentDate: Date;
  tasksByDate: Record<string, Task[]>;
  onDateSelect: (date: Date) => void;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ currentDate, tasksByDate, onDateSelect }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const formatDuration = (milliseconds: number) => {
    const hours = milliseconds / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  const getDaysInMonth = () => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthlyData = () => {
    const daysInMonth = getDaysInMonth();
    const dailyData = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayTasks = tasksByDate[dateKey] || [];
      const completedTasks = dayTasks.filter(task => task.duration > 0);
      const totalDuration = completedTasks.reduce((sum, task) => sum + task.duration, 0);
      
      dailyData.push({
        day: day,
        date: date,
        tasks: completedTasks.length,
        hours: parseFloat(formatDuration(totalDuration)),
        totalDuration: totalDuration
      });
    }
    
    return dailyData;
  };

  const getTaskDistribution = () => {
    const taskNames: Record<string, number> = {};
    
    Object.values(tasksByDate).forEach(dayTasks => {
      dayTasks.forEach(task => {
        if (task.duration > 0) {
          const taskDate = new Date(task.startTime);
          if (taskDate.getFullYear() === year && taskDate.getMonth() === month) {
            taskNames[task.name] = (taskNames[task.name] || 0) + task.duration;
          }
        }
      });
    });

    const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    
    return Object.entries(taskNames)
      .map(([name, duration], index) => ({
        name,
        value: parseFloat(formatDuration(duration)),
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getMonthlyStats = () => {
    const monthlyData = getMonthlyData();
    const totalTasks = monthlyData.reduce((sum, day) => sum + day.tasks, 0);
    const totalHours = monthlyData.reduce((sum, day) => sum + day.hours, 0);
    const activeDays = monthlyData.filter(day => day.tasks > 0).length;
    const avgTasksPerDay = activeDays > 0 ? totalTasks / activeDays : 0;
    
    return { totalTasks, totalHours, activeDays, avgTasksPerDay };
  };

  const monthlyData = getMonthlyData();
  const taskDistribution = getTaskDistribution();
  const stats = getMonthlyStats();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/30">
          <p className="font-semibold text-gray-800">Day {label}</p>
          <p className="text-sm text-emerald-600">Tasks: {payload[0]?.value || 0}</p>
          <p className="text-sm text-purple-600">Hours: {payload[1]?.value || 0}h</p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/30">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">{data.value}h total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl 
                    hover:shadow-3xl transition-all duration-500 animate-slide-down">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 animate-fade-in">
              {monthName} Overview
            </h1>
            <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium animate-fade-in-delayed">
              Your monthly productivity journey 📊✨
            </p>
          </div>
          <Calendar size={40} className="text-white/80 animate-float sm:w-14 sm:h-14" />
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30 
                      hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-slide-up">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl shadow-lg">
              <Target className="text-white" size={20} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Total Tasks</h3>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30 
                      hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-slide-up" 
             style={{animationDelay: '0.1s'}}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl shadow-lg">
              <Clock className="text-white" size={20} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Total Hours</h3>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30 
                      hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-slide-up" 
             style={{animationDelay: '0.2s'}}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl sm:rounded-2xl shadow-lg">
              <Calendar className="text-white" size={20} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Active Days</h3>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.activeDays}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/30 
                      hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-slide-up" 
             style={{animationDelay: '0.3s'}}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl sm:rounded-2xl shadow-lg">
              <TrendingUp className="text-white" size={20} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">Avg Tasks/Day</h3>
              <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.avgTasksPerDay.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 
                    hover:shadow-3xl transition-all duration-500 animate-slide-up">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
          <TrendingUp className="text-emerald-600" size={24} />
          Daily Activity Overview
        </h3>
        
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
              <XAxis 
                dataKey="day" 
                stroke="#6b7280"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="tasks" 
                fill="url(#tasksGradient)" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
              <Bar 
                dataKey="hours" 
                fill="url(#hoursGradient)" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationBegin={500}
              />
              <defs>
                <linearGradient id="tasksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Distribution */}
      {taskDistribution.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 
                      hover:shadow-3xl transition-all duration-500 animate-slide-up">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
            <Flower2 className="text-pink-600" size={24} />
            Task Distribution This Month
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {taskDistribution.map((task, index) => (
                <div key={task.name} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                                               bg-gradient-to-r from-gray-50 to-white hover:from-emerald-50 hover:to-teal-50
                                               transition-all duration-300 border border-gray-200 hover:border-emerald-200
                                               animate-slide-in-right" 
                     style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg flex-shrink-0"
                      style={{ backgroundColor: task.color }}
                    ></div>
                    <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">{task.name}</span>
                  </div>
                  <span className="font-bold text-gray-600 text-sm sm:text-base flex-shrink-0">{task.value}h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Most Productive Days */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 
                    hover:shadow-3xl transition-all duration-500 animate-slide-up">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Most Productive Days</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {monthlyData
            .filter(day => day.tasks > 0)
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 6)
            .map((day, index) => (
              <button
                key={day.day}
                onClick={() => onDateSelect(day.date)}
                className="p-3 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 
                         hover:from-emerald-100 hover:to-teal-100 transition-all duration-300
                         border border-emerald-200 hover:border-emerald-300 hover:shadow-lg hover:scale-105
                         animate-slide-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-emerald-600 mb-1 sm:mb-2">
                    {day.date.toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                    {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-800">
                    {day.tasks} tasks • {day.hours}h
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>

      {stats.totalTasks === 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-12 sm:p-16 shadow-2xl border border-white/30 text-center animate-fade-in">
          <Flower2 size={48} className="text-gray-300 mx-auto mb-4 sm:mb-6 animate-float sm:w-16 sm:h-16" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-3 sm:mb-4">No tasks completed this month</h3>
          <p className="text-gray-500 text-base sm:text-lg">
            Start your productivity journey and watch your garden of achievements grow! 🌱✨
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthlyView;