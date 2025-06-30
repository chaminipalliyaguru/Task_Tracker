import React, { useState, useEffect } from 'react';
import { Play, Square, Plus, Clock, Trash2, Sparkles, Timer } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  isActive: boolean;
}

interface TaskTrackerProps {
  selectedDate: Date;
  onTasksUpdate: (date: Date, tasks: Task[]) => void;
  tasks: Task[];
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ selectedDate, onTasksUpdate, tasks }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [currentTasks, setCurrentTasks] = useState<Task[]>(tasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setCurrentTasks(tasks);
    const activeTask = tasks.find(task => task.isActive);
    setActiveTaskId(activeTask?.id || null);
  }, [tasks]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      name: newTaskName.trim(),
      startTime: new Date(),
      duration: 0,
      isActive: false
    };

    const updatedTasks = [...currentTasks, newTask];
    setCurrentTasks(updatedTasks);
    onTasksUpdate(selectedDate, updatedTasks);
    setNewTaskName('');
  };

  const startTask = (taskId: string) => {
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isActive: true, startTime: new Date() };
      }
      return { ...task, isActive: false };
    });

    setCurrentTasks(updatedTasks);
    setActiveTaskId(taskId);
    onTasksUpdate(selectedDate, updatedTasks);
  };

  const endTask = (taskId: string) => {
    const updatedTasks = currentTasks.map(task => {
      if (task.id === taskId && task.isActive) {
        const endTime = new Date();
        const duration = task.duration + (endTime.getTime() - task.startTime.getTime());
        return {
          ...task,
          isActive: false,
          endTime,
          duration
        };
      }
      return task;
    });

    setCurrentTasks(updatedTasks);
    setActiveTaskId(null);
    onTasksUpdate(selectedDate, updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    setCurrentTasks(updatedTasks);
    onTasksUpdate(selectedDate, updatedTasks);
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  const getCurrentTaskDuration = (task: Task) => {
    if (!task.isActive) return task.duration;
    return task.duration + (currentTime.getTime() - task.startTime.getTime());
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/30
                  hover:shadow-3xl transition-all duration-500 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl shadow-lg animate-pulse-gentle">
          <Clock className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {isToday ? "Today's Tasks" : `Tasks for ${selectedDate.toLocaleDateString()}`}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Sparkles size={12} className="text-yellow-500 animate-twinkle sm:w-3.5 sm:h-3.5" />
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              {isToday ? "Track your productive journey" : "View completed tasks"}
            </span>
          </div>
        </div>
      </div>

      {isToday && (
        <div className="mb-6 sm:mb-8 animate-slide-down">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="What would you like to accomplish? ✨"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-gray-200 focus:border-emerald-400
                       focus:ring-4 focus:ring-emerald-100 outline-none transition-all duration-300
                       bg-white/70 backdrop-blur-sm text-gray-800 placeholder-gray-500
                       hover:border-emerald-300 hover:shadow-lg text-sm sm:text-base"
            />
            <button
              onClick={addTask}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-white rounded-xl sm:rounded-2xl
                       hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-600 transition-all duration-500
                       hover:scale-105 hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 sm:gap-3 font-semibold
                       animate-glow text-sm sm:text-base"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {currentTasks.length === 0 ? (
          <div className="text-center py-12 sm:py-16 animate-fade-in">
            <Timer size={40} className="text-gray-300 mx-auto mb-4 animate-float sm:w-12 sm:h-12" />
            <div className="text-gray-400 text-lg sm:text-xl mb-3 font-medium">No tasks for this day</div>
            <div className="text-gray-300 text-sm">
              {isToday ? "Add your first task above to begin your productive journey! 🌱" : ""}
            </div>
          </div>
        ) : (
          currentTasks.map((task, index) => (
            <div
              key={task.id}
              className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-500 animate-slide-in-right
                        hover:shadow-xl ${
                task.isActive
                  ? 'border-emerald-400 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 shadow-xl scale-[1.02] animate-glow-soft'
                  : 'border-gray-200 bg-white/60 hover:bg-white/80 hover:border-emerald-200 hover:scale-[1.01]'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg break-words">{task.name}</h3>
                    {task.isActive && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full self-start">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                          Active
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span className="font-medium">
                        Duration: {formatDuration(getCurrentTaskDuration(task))}
                      </span>
                    </div>
                    {task.startTime && (
                      <div className="flex items-center gap-2">
                        <Timer size={14} />
                        <span>Started: {task.startTime.toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center">
                  {isToday && !task.isActive && (
                    <button
                      onClick={() => startTask(task.id)}
                      disabled={activeTaskId !== null}
                      className="p-2 sm:p-3 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white rounded-lg sm:rounded-xl
                               hover:from-emerald-500 hover:to-emerald-600 transition-all duration-300
                               hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                               shadow-lg hover:shadow-xl group"
                    >
                      <Play size={16} className="group-hover:scale-110 transition-transform duration-200 sm:w-4 sm:h-4" />
                    </button>
                  )}

                  {isToday && task.isActive && (
                    <button
                      onClick={() => endTask(task.id)}
                      className="p-2 sm:p-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg sm:rounded-xl
                               hover:from-red-500 hover:to-red-600 transition-all duration-300
                               hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl group"
                    >
                      <Square size={16} className="group-hover:scale-110 transition-transform duration-200 sm:w-4 sm:h-4" />
                    </button>
                  )}

                  {isToday && (
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 sm:p-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg sm:rounded-xl
                               hover:from-gray-500 hover:to-gray-600 transition-all duration-300
                               hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl group"
                    >
                      <Trash2 size={16} className="group-hover:scale-110 transition-transform duration-200 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskTracker;