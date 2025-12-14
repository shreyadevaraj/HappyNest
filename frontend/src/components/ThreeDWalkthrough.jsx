import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, useGLTF, Environment, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';

// --- CONSTANTS ---
const MOVEMENT_SPEED = 5.0;

// --- ERROR BOUNDARY FOR MISSING MODEL ---
class ModelErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("3D Model failed to load:", error);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Html center>
                    <div className="bg-black/90 text-white p-8 rounded-xl border border-red-500 max-w-lg text-center">
                        <h3 className="text-2xl font-bold text-red-500 mb-4">⚠️ Asset Missing</h3>
                        <p className="mb-4 text-lg">
                            Realistic interiors require an external 3D asset.
                        </p>
                        <p className="text-stone-400 text-sm mb-6">
                            Please place a valid GLtf/GLB model file named
                            <span className="text-emerald-400 font-mono mx-2">house.gltf</span>
                            into the <span className="font-mono">frontend/public/models/</span> folder.
                        </p>
                        <p className="text-xs text-stone-500">
                            (System configured to load: /models/house.gltf)
                        </p>
                    </div>
                </Html>
            );
        }
        return this.props.children;
    }
}

// --- LOADING INDICATOR ---
const Loader = () => {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center bg-black/80 p-6 rounded-xl border border-emerald-500/30 backdrop-blur-md">
                <div className="text-emerald-400 font-bold text-3xl mb-2">{progress.toFixed(0)}%</div>
                <div className="text-white text-sm mb-4">Loading 3D House Model...</div>
                <div className="w-48 h-2 bg-stone-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-stone-500 mt-2 text-center max-w-[200px]">
                    (Large dataset: 160MB. Please wait.)
                </p>
            </div>
        </Html>
    );
};

// --- REALISTIC MODEL LOADER ---
const Model = ({ url }) => {
    // Enable Draco compression support (uses Google CDN decoder by default)
    // This handles cases where the GLTF uses Draco/Meshopt extensions
    const { scene } = useGLTF(url);

    // Auto-enable shadows for all meshes in the loaded model
    scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            // Ensure materials handle lighting correctly
            if (child.material) {
                child.material.envMapIntensity = 1.2; // Slight boost
                child.material.needsUpdate = true;
            }
        }
    });

    return <primitive object={scene} scale={[1, 1, 1]} position={[0, 0, 0]} />;
};

// --- PLAYER CONTROLLER (WASD) ---
const PlayerController = ({ activeLocation }) => {
    const { camera } = useThree();
    const moveState = useRef({ forward: false, backward: false, left: false, right: false });
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());

    useEffect(() => {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': moveState.current.forward = true; break;
                case 'ArrowLeft':
                case 'KeyA': moveState.current.left = true; break;
                case 'ArrowDown':
                case 'KeyS': moveState.current.backward = true; break;
                case 'ArrowRight':
                case 'KeyD': moveState.current.right = true; break;
            }
        };
        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': moveState.current.forward = false; break;
                case 'ArrowLeft':
                case 'KeyA': moveState.current.left = false; break;
                case 'ArrowDown':
                case 'KeyS': moveState.current.backward = false; break;
                case 'ArrowRight':
                case 'KeyD': moveState.current.right = false; break;
            }
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    useEffect(() => {
        if (activeLocation) {
            camera.position.set(activeLocation.x, activeLocation.y, activeLocation.z);
            camera.lookAt(0, 1.5, 0);
        }
    }, [activeLocation, camera]);

    useFrame((state, delta) => {
        velocity.current.x -= velocity.current.x * 10.0 * delta;
        velocity.current.z -= velocity.current.z * 10.0 * delta;
        direction.current.z = Number(moveState.current.forward) - Number(moveState.current.backward);
        direction.current.x = Number(moveState.current.right) - Number(moveState.current.left);
        direction.current.normalize();

        if (moveState.current.forward || moveState.current.backward) velocity.current.z -= direction.current.z * 40.0 * delta;
        if (moveState.current.left || moveState.current.right) velocity.current.x -= direction.current.x * 40.0 * delta;

        if (moveState.current.forward) camera.translateZ(-MOVEMENT_SPEED * delta);
        if (moveState.current.backward) camera.translateZ(MOVEMENT_SPEED * delta);
        if (moveState.current.left) camera.translateX(-MOVEMENT_SPEED * delta);
        if (moveState.current.right) camera.translateX(MOVEMENT_SPEED * delta);

        // Simple floor collision (prevent falling through infinity if model has no floor collider logic yet)
        if (camera.position.y < 1.7) camera.position.y = 1.7;
    });

    return null;
};

// --- MAIN COMPONENT ---
const ThreeDWalkthrough = ({ onClose }) => {
    const [activeLocation, setActiveLocation] = useState({ name: 'Entrance', x: 0, y: 1.7, z: 8 });
    const [isLocked, setIsLocked] = useState(false);

    // Standard hotspots for a typical house model
    const locations = [
        { name: 'Entrance', x: 0, y: 1.7, z: 5 },
        { name: 'Living Room', x: 0, y: 1.7, z: 0 },
        { name: 'Kitchen', x: -4, y: 1.7, z: -2 },
        { name: 'Bedroom', x: 4, y: 1.7, z: -2 },
        { name: 'Upstairs', x: 0, y: 4.5, z: 0 },
    ];

    return (
        <div className="fixed inset-0 z-[100] bg-black font-sans">
            {/* UI OVERLAY */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
                <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl text-white pointer-events-auto">
                    <h2 className="text-2xl font-bold mb-2">3D Home Tour</h2>
                    <p className="text-sm opacity-80 mb-4">Realistic Interior View</p>

                    <div className="flex flex-wrap gap-2">
                        {locations.map(loc => (
                            <button
                                key={loc.name}
                                onClick={() => setActiveLocation(loc)}
                                className={`px-3 py-1 text-sm rounded-lg border transition ${activeLocation.name === loc.name ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 hover:bg-white/10'}`}
                            >
                                {loc.name}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="bg-white/10 hover:bg-red-600 text-white p-3 rounded-full backdrop-blur-md transition pointer-events-auto group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {!isLocked && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="bg-black/40 text-white px-6 py-3 rounded-full backdrop-blur font-bold animate-pulse">
                        Click to control camera
                    </div>
                </div>
            )}

            {isLocked && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full pointer-events-none z-10 mix-blend-difference" />
            )}

            <Canvas shadows camera={{ fov: 60, position: [0, 1.7, 5] }}>
                <Suspense fallback={<Loader />}>

                    <color attach="background" args={['#1a1a1a']} />
                    <Environment preset="apartment" />
                    <fog attach="fog" args={['#1a1a1a', 5, 30]} />

                    {/* LOAD REAL MODEL */}
                    <Model url="/models/house.glb" />


                    <PlayerController activeLocation={activeLocation} />
                    <PointerLockControls
                        onLock={() => setIsLocked(true)}
                        onUnlock={() => setIsLocked(false)}
                    />

                </Suspense>
            </Canvas>
        </div>
    );
};

export default ThreeDWalkthrough;
