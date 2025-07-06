import React, { useState } from 'react';
import { AddTaskModal } from '@/components/AddTaskModal';
import { UserProfile } from '@/components/UserProfile';
import { useTasks } from '@/hooks/useTasks';
import { supabase } from '@/lib/supabase';
import { Check, X, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TaskManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { tasks, loading, error, addTask, toggleTask, deleteTask, refetch } = useTasks();

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTaskSubmit = async (taskTitle: string) => {
    try {
      await addTask(taskTitle);
      console.log('Task added:', taskTitle);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      await toggleTask(taskId);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with sign out button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-4">Live Vibe - Artist Platform</h1>
            <p className="text-muted-foreground mb-6">
              The ultimate AI-powered artist ecosystem, empowering independent artists, event organizers, and fans.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="max-w-md mx-auto">
          <UserProfile />
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleAddTask}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Add Task
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && tasks.length === 0 && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        )}

        {/* Display tasks */}
        {!loading && tasks.length > 0 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your Tasks ({tasks.length}):</h2>
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-3 bg-card rounded-lg border group hover:shadow-md transition-shadow duration-200">
                  <span 
                    className={`flex-1 ${
                      task.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </span>
                  
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        task.completed
                          ? 'bg-green-100 text-green-600 hover:bg-green-200 focus:ring-green-500'
                          : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600 focus:ring-green-500'
                      }`}
                      title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      title="Delete task"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* AI Image below the tasks table */}
            <div className="mt-8 text-center">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">AI-Powered Productivity</h3>
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="AI and technology concept with futuristic digital interface"
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Enhance your productivity with AI-driven insights and smart task management
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && tasks.length === 0 && !error && (
          <div className="text-center">
            <p className="text-muted-foreground mb-8">No tasks yet. Add your first task to get started!</p>
            
            {/* AI Image for empty state */}
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">AI-Powered Productivity</h3>
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="AI and technology concept with futuristic digital interface"
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  Enhance your productivity with AI-driven insights and smart task management
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTask={handleAddTaskSubmit}
      />
    </div>
  );
}