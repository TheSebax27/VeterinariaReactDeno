// src/App.tsx

import React from 'react';
import { AppRouter } from './Router/AppRouter.tsx';

function App() {
  return (
    <div className="App" style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb' 
    }}>
      <AppRouter />
    </div>
  );
}

export default App;