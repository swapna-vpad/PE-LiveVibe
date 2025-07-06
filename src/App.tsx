import React from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';
import { TaskManager } from '@/components/TaskManager';

function App() {
  return (
    <AuthWrapper>
      <TaskManager />
    </AuthWrapper>
  );
}

export default App;