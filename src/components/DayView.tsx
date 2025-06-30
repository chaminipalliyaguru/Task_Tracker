import React from 'react';
import { BarChart3, Clock, TrendingUp, Flower2, PieChart } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Task {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isActive: boolean;
}

interface DayViewProps {
  selectedDate: Date;
  tasks: Task[];
}

const DayView: React.FC<DayViewProps> = ({ selectedDate, tasks }) => {
  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  const getTotalDuration = () => {
    return tasks.reduce((total, task) => total + task.duration, 0);
  };

  const getTotalHours = () => {
    const totalMs = getTotalDuration();
    return (totalMs / (1000 * 60 * 60)).toFixed(1);
  };

  const getTaskPercentage = (task: Task) => {
    const total = getTotalDuration();
    if (total === 0) return 0;
    return (task.duration / total) * 100;
  };

  const completedTasks = tasks.filter(task => task.duration > 0);

  const getDateMoodGradient = (date: Date) => {
    const day = date.getDate();
    const gradients = [
      'from-rose-300 via-pink-300 to-purple-400',
      'from-emerald-300 via-teal-300 to-cyan-400',
      'from-amber-300 via-orange-300 to-red-400',
      'from-indigo-300 via-purple-300 to-pink-400',
      'from-green-300 via-emerald-300 to-teal-400',
      'from-orange-300 via-red-300 to-rose-400',
      'from-blue-300 via-indigo-300 to-purple-400'
    ];
    return gradients[day % gradients.length];
  };

  const colors = [
    '#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const pieData = completedTasks.map((task, index) => ({
    name: task.name,
    value: Math.round(getTaskPercentage(task) * 100) / 100,
    duration: formatDuration(task.duration),
    color: colors[index % colors.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/30">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">Duration: {data.duration}</p>
          <p className="text-sm text-gray-600">Percentage: {data.value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className={`bg-gradient-to-br ${getDateMoodGradient(selectedDate)} rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl 
                     hover:shadow-3xl transition-all duration-500 animate-slide-down`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 animate-fade-in">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h1>
            <p className="text-white/90 text-base sm:text-lg lg:text-xl font-medium animate-fade-in-delayed">
              {selectedDate.toDateString() === new Date().toDateString() 
                ? "Today's Productive Journey ✨" 
                : "Daily Reflection & Insights 🌸"
              }
            </p>
          </div>
          <Flower2 size={40} className="text-white/80 animate-spin-slow sm:w-14 sm:h-14" />
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 
                      hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-slide-up">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl shadow-lg animate-pulse-gentle">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">Tasks Completed</h3>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600 animate-count-up">{completedTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 
                      hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-slide-up" 
             style={{animationDelay: '0.1s'}}>
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl sm:rounded-2xl shadow-lg animate-pulse-gentle">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">Productive Hours</h3>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 animate-count-up">{getTotalHours()}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 
                      hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-slide-up sm:col-span-2 lg:col-span-1" 
             style={{animationDelay: '0.2s'}}>
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl sm:rounded-2xl shadow-lg animate-pulse-gentle">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base sm:text-lg">Avg. Task Duration</h3>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600 animate-count-up">
                {completedTasks.length > 0 
                  ? formatDuration(getTotalDuration() / completedTasks.length)
                  : '0m'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Pie Chart */}
      {completedTasks.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 
                      hover:shadow-3xl transition-all duration-500 animate-slide-up">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-3">
            <PieChart className="text-emerald-600" size={24} />
            Time Distribution Visualization
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {completedTasks.map((task, index) => {
                const percentage = getTaskPercentage(task);
                return (
                  <div key={task.id} className="group animate-slide-in-right" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div 
                          className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg flex-shrink-0"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">{task.name}</span>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs sm:text-sm font-bold text-gray-600">
                          {formatDuration(task.duration)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1 sm:ml-2">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
                      <div
                        className="h-full transition-all duration-2000 ease-out rounded-full shadow-sm"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: colors[index % colors.length],
                          background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[index % colors.length]}dd)`
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Task Details */}
      {completedTasks.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/30 
                      hover:shadow-3xl transition-all duration-500 animate-slide-up">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Detailed Task Timeline</h3>
          <div className="space-y-3 sm:space-y-4">
            {completedTasks.map((task, index) => (
              <div
                key={task.id}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-gray-50 via-white to-gray-50 
                         hover:from-emerald-50 hover:via-teal-50 hover:to-cyan-50 transition-all duration-500
                         border border-gray-200 hover:border-emerald-200 hover:shadow-xl hover:scale-[1.02]
                         animate-slide-in-left"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div 
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-lg animate-pulse-gentle flex-shrink-0"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      ></div>
                      <h4 className="font-bold text-gray-800 text-base sm:text-lg break-words">{task.name}</h4>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2 ml-6 sm:ml-8">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>Started: {task.startTime.toLocaleTimeString()}</span>
                      </div>
                      {task.endTime && (
                        <div className="flex items-center gap-2">
                          <Clock size={12} />
                          <span>Ended: {task.endTime.toLocaleTimeString()}</span>
                        </div>
                      )}
                      <div className="font-semibold text-emerald-600 flex items-center gap-2">
                        <TrendingUp size={12} />
                        <span>Duration: {formatDuration(task.duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedTasks.length === 0 && (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-12 sm:p-16 shadow-2xl border border-white/30 text-center animate-fade-in">
          <Flower2 size={48} className="text-gray-300 mx-auto mb-4 sm:mb-6 animate-float sm:w-16 sm:h-16" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-600 mb-3 sm:mb-4">No completed tasks yet</h3>
          <p className="text-gray-500 text-base sm:text-lg">
            {selectedDate.toDateString() === new Date().toDateString() 
              ? "Start tracking tasks to see your beautiful progress bloom! 🌱" 
              : "No tasks were completed on this peaceful day. 🌸"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DayView;