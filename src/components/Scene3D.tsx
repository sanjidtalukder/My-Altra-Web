import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Floating node component
const FloatingNode: React.FC<{ 
  position: [number, number, number]; 
  color: string; 
  type: 'hazard' | 'community';
  scale?: number;
}> = ({ position, color, type, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group position={position}>
      {type === 'hazard' ? (
        <Box ref={meshRef} args={[0.3 * scale, 0.3 * scale, 0.3 * scale]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </Box>
      ) : (
        <Sphere ref={meshRef} args={[0.2 * scale]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </Sphere>
      )}
    </group>
  );
};

// Connection line component
const ConnectionLine: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}> = ({ start, end, color }) => {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  return (
    <Line
      points={points}
      color={color}
      lineWidth={2}
      opacity={0.6}
      transparent
    />
  );
};

// Main 3D scene
const Scene3D: React.FC = () => {
  // Node positions (hazards and communities)
  const hazardNodes = [
    { pos: [-2, 1, -1] as [number, number, number], color: '#ff4757' },
    { pos: [1, -0.5, 2] as [number, number, number], color: '#3742fa' },
    { pos: [0, 2, 0] as [number, number, number], color: '#57606f' },
  ];

  const communityNodes = [
    { pos: [-1, -1, 1] as [number, number, number], color: '#00d4ff' },
    { pos: [2, 0.5, -2] as [number, number, number], color: '#00d4ff' },
    { pos: [-2, -2, -1] as [number, number, number], color: '#00d4ff' },
  ];

  const connections = [
    { start: hazardNodes[0].pos, end: communityNodes[0].pos, color: '#ff4757' },
    { start: hazardNodes[1].pos, end: communityNodes[1].pos, color: '#3742fa' },
    { start: hazardNodes[2].pos, end: communityNodes[2].pos, color: '#57606f' },
    { start: hazardNodes[0].pos, end: communityNodes[2].pos, color: '#ff6b00' },
  ];

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-base-300/10 to-base-200/5">
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} color="#00d4ff" intensity={0.5} />
        <pointLight position={[-10, -10, -10]} color="#ff4757" intensity={0.3} />

        {/* Controls */}
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />

        {/* Connection lines */}
        {connections.map((connection, index) => (
          <ConnectionLine
            key={index}
            start={connection.start}
            end={connection.end}
            color={connection.color}
          />
        ))}

        {/* Hazard nodes */}
        {hazardNodes.map((node, index) => (
          <FloatingNode
            key={`hazard-${index}`}
            position={node.pos}
            color={node.color}
            type="hazard"
            scale={1.2}
          />
        ))}

        {/* Community nodes */}
        {communityNodes.map((node, index) => (
          <FloatingNode
            key={`community-${index}`}
            position={node.pos}
            color={node.color}
            type="community"
          />
        ))}

        {/* Grid helper for reference */}
        <gridHelper args={[10, 10, '#00d4ff', '#00d4ff']} />
      </Canvas>
    </div>
  );
};

export default Scene3D;