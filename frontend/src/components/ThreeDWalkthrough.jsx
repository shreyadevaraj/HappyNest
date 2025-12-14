import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Plane } from '@react-three/drei';

const DebugScene = () => {
    return (
        <group>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Box position={[0, 0.5, 0]}>
                <meshStandardMaterial color="red" />
            </Box>
            <Plane rotation={[-Math.PI / 2, 0, 0]} args={[10, 10]} receiveShadow>
                <meshStandardMaterial color="#ddd" />
            </Plane>
        </group>
    );
};

const ThreeDWalkthrough = ({ planType, onClose }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <div className="absolute top-4 right-4 z-50">
                <button onClick={onClose} className="bg-red-600 text-white px-4 py-2 rounded font-bold">
                    CLOSE (Debug Mode)
                </button>
            </div>

            <Canvas camera={{ position: [0, 2, 5] }}>
                <color attach="background" args={['#333']} />
                <DebugScene />
                <OrbitControls />
            </Canvas>
        </div>
    );
};

export default ThreeDWalkthrough;
