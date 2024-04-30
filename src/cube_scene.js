import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import Cursor from './Cursor'; // Assume Cursor is exported from another file



// Generate random cubes with unique positions
const generateRandomCubes = (count) => {
  const cubes = [];
  for (let i = 0; i < count; i++) {
    const position = [
      (Math.random() - 0.5) * 10, // Random position between -5 and 5 (x)
      (Math.random() - 0.5) * 10, // Random position between -5 and 5 (y)
      (Math.random() - 0.5) * 10, // Random position between -5 and 5 (z)
    ];
    const color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`; // Random color
    cubes.push({ position, color });
  }
  return cubes;
};

const RandomCubesScene = () => {
  const randomCubes = generateRandomCubes(10); // Generate 10 random cubes

  return (
    <Canvas>
      {/* Add basic lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Create cubes at random positions */}
      {randomCubes.map((cube, index) => (
        <Box key={index} position={cube.position} args={[1, 1, 1]}>
          <meshStandardMaterial color={cube.color} />
        </Box>
      ))}
      <Cursor />
      
      {/*<Cursor />*/}

      <OrbitControls />

    </Canvas>
  );
};

export default RandomCubesScene;
