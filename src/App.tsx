import React, { useState } from 'react';
import { AddTaskModal } from '@/components/AddTaskModal';
import { Check, X } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddTaskSubmit = (taskText: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      text: taskText,
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
    console.log('Task added:', taskText);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Live Vibe - Artist Platform</h1>
          <p className="text-muted-foreground mb-6">
            The ultimate AI-powered artist ecosystem, empowering independent artists, event organizers, and fans.
          </p>
          
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

        {/* Display tasks if any */}
        {tasks.length > 0 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your Tasks:</h2>
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
                    {task.text}
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

export default App;