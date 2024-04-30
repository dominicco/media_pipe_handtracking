import React, { createContext, useState, useContext } from 'react';

// Create the context object
const CursorContext = createContext();

// Custom hook to use the context
export const useCursor = () => useContext(CursorContext);

// Provider component that wraps your application and provides state
export const CursorProvider = ({ children }) => {
  //const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [landmarks, setLandmarks] = useState([]);  // Array of landmarks
  
  const [selectedObjectId, setSelectedObjectId] = useState(null);

  // Modified setCursorPosition to log updates
  //const updateCursorPosition = (newPosition) => {
  //  console.log("Cursor position updated:", newPosition);
  //  setCursorPosition(newPosition);
  //};

  // Function to update landmarks
  const updateLandmarks = (newLandmarks) => {
    if (newLandmarks) {
      setLandmarks(newLandmarks);
      //console.log("Landmarks Set", newLandmarks);
    } else {
      console.log("Failed to fetch landmarks or received null/undefined");
    }
  };

  // Value that will be accessible to any descendant component
  const value = {
    //cursorPosition,
    landmarks,
    updateLandmarks,
    //setCursorPosition: updateCursorPosition,
    selectedObjectId,
    setSelectedObjectId
  };

  return (
    <CursorContext.Provider value={value}>
      {children}
    </CursorContext.Provider>
  );
};
