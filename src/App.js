import React from 'react';
import HandTrackingComponent from './HandTracker';
import RandomCubesScene from './cube_scene';
import { CursorProvider } from './CursorContext';



const App = () => (
  <div>
    <h1>MediaPipe Hand Tracking</h1>

    <CursorProvider>
    <HandTrackingComponent />
    <div style={{ width: '1000px', height: '1000px' }}>
      <RandomCubesScene />
    </div>
    </CursorProvider>
  

    
    

    
  </div>
);

export default App;
