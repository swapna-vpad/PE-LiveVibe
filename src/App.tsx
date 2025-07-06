import React from 'react'

function App() {
  const handleAddTask = () => {
    // TODO: Implement add task functionality
    console.log('Add task clicked');
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
      </div>
    </div>
  )
}

export default App