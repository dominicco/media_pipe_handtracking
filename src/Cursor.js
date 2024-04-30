import React, { useRef , useEffect, useState} from 'react';
import { useFrame } from '@react-three/fiber';
import { useCursor } from './CursorContext'; // Import the context hook

const Cursor = () => {
  
  //const { cursorPosition } = useCursor(); // Get the cursorPosition from the context
  const { landmarks } = useCursor();
  console.log("BLAB", landmarks)
  const meshesRef = useRef([]);
  



  //const cursorRef = useRef();
  const [refsReady, setRefsReady] = useState(false);



  
  

  useEffect(() => {
    meshesRef.current = landmarks.map(() => React.createRef());
    console.log("refs created")
    // A function to check if all refs are attached to the mesh elements
    const checkRefs = () => {
        const allRefsAttached = meshesRef.current.every(ref => ref.current !== null);
        if (allRefsAttached) {
            setRefsReady(true);
            console.log("All refs are now attached.");
            setTimeout(checkRefs, 100); // Retry after a short delay
        } else {
            console.log("Waiting for refs to attach...");
            setTimeout(checkRefs, 100); // Retry after a short delay
        }
    };
    // Start the ref attachment check
    checkRefs();
}, [landmarks]);


  // Helper function to clamp values within a range
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));


  useFrame(({ size }) => {
    
    console.log("Refs Ready?", refsReady);
    console.log("Landmarks length:", landmarks.length);
    console.log("Are all refs attached?", refsReady, refsReady && meshesRef.current.every(ref => ref.current !== null));
    console.log(meshesRef.current.length)
    // Safeguard inside useFrame to ensure landmarks and meshesRef are defined and not empty
    if (refsReady && landmarks.length > 0 && meshesRef.current.every(ref => ref.current !== null)) {
      
      landmarks.forEach((landmark, index) => {
        const mesh = meshesRef.current[index];
        console.log(mesh)

        if (mesh) {
          console.log(`Mesh ${index} successfully accessed.`);
          console.log(landmark.x)
          const x = (landmark.x) * 5;  // Mapping directly to -5 to 5
          const y = (landmark.y) * 5;  // Mapping directly to -5 to 5
          mesh.position.set(x, y, 0);
          console.log(`Mesh ${index} position set to:`, x, y);

        }
      });
    }
  });

  // Early return if no landmarks are available
  if (!landmarks || landmarks.length === 0) {
    console.log("bukidnon");
    return null; // Or return a loading indicator or placeholder
  }



  //useFrame(() => {
    // Normalize cursor position and apply clamping
  //  const x = clamp((cursorPosition.x - 0.5) * 10, -10, 10); // Adjust range as necessary
  //  const y = clamp(-(cursorPosition.y - 0.5) * 10, -10, 10); // Adjust range as necessary

  //  if (cursorRef.current) {
  //    cursorRef.current.position.x = x;
  //    cursorRef.current.position.y = y;
  //  }
  //  console.log("adasd ", cursorPosition.x);
  //});

  return (

    <>
      {landmarks.map((_, index) => (
        <mesh
          key={index}
          ref={el => {
            meshesRef.current[index] = el;
            console.log(`Ref for mesh ${index} set:`, el); // Logging the ref assignment
        }}
        position={[0, 0, 0]}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
    </>




    //<mesh ref={cursorRef} position={[0, 0, 0]}>
    //  <sphereGeometry args={[.7, 16, 16]} />
    //  <meshStandardMaterial color="red" />
   // </mesh>
  );
};

export default Cursor;
