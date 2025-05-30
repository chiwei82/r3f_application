import { useRef, useEffect, useState } from 'react';
import { useControls, Leva } from 'leva';
import { useSpring } from '@react-spring/three';
import Controls from './components/Controls';
import Lights from './components/Lights';
import PhysicsWorld from './components/PhysicsWorld';
import ReactLogo from './components/objects/ReactLogo';
import CardboardBox from './components/objects/CardboardBox';
import Clipboard from './components/objects/Clipboard';
import Ground from './components/objects/Ground';
import PerfMonitor from './components/ui/PerfMonitor';
import './App.css';

function App() {
  // Leva controls and states remain in App
  const { cp_x, cp_y, cp_z , cpr_x, cpr_y, cpr_z } = useControls('board', {
    cp_x: { value: -0.2, min: -5, max: 5, step: 0.1 },
    cp_y: { value: -1.2, min: -5, max: 5, step: 0.1 },
    cp_z: { value: -0.8, min: -5, max: 5, step: 0.1 },
    cpr_x: { value: -5, min: -10, max: 360, step: Math.PI/360 },
    cpr_y: { value: 0, min: -5, max: 360, step: Math.PI/360 },
    cpr_z: { value: 0, min: -5, max: 360, step: Math.PI/360 },
  });
  const { Light_Helper } = useControls('Light', { Light_Helper: { value: false } });
  const { PhysicsDebug } = useControls('Physics', { PhysicsDebug: { value: false } });
  const { Apply_SoftShadows, size, samples, distance, bias, opacity } = useControls('SoftShadows', {
    Apply_SoftShadows: { value: true },
    size: { value: 10, min: 0, max: 100, step: 1 },
    samples: { value: 8, min: 0, max: 100, step: 1 },
    distance: { value: 8, min: 0, max: 100, step: 1 },
    bias: { value: -0.0005, min: -1, max: 1, step: 0.0001 },
    opacity: { value: 0.2, min: 0, max: 100, step: 0.1 },
  });
  const { positionX, positionY, positionZ, intensity } = useControls('directionalLight', {
    positionX: { value: -4, min: -5, max: 5, step: 1 },
    positionY: { value: 4, min: -5, max: 10, step: 1 },
    positionZ: { value: 3, min: -5, max: 5, step: 1 },
    intensity: { value: 3, min: 0, max: 10, step: 1 }
  });
  const { ambientLightIntensiity } = useControls('AmbientLight', {
    ambientLightIntensiity: { value: 0.5, min: 0, max: 5, step: 0.1 }
  });
  const { show, perf_position } = useControls('Perf', {
    show: { value: false },
    perf_position: {
      value: 'top-left',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    }
  });

  // clipboard detail controls
  const [active, setActive] = useState(false);
  const [hasDropped, setHasDropped] = useState(false);
  const [spring, api] = useSpring(() => ({
    position: [cp_x, cp_y, cp_z],
    rotation: [cpr_x, cpr_y, cpr_z],
    config: { mass: 1, tension: 120, friction: 18 },
  }));

  useEffect(() => {
    if (active) {
      api.start({
        position: [1, 2.5, 2],
        rotation: [Math.PI / 6, Math.PI / 8, -Math.PI / 12],
      });
    }
  }, [active]);

  const handleClick = () => {
    setActive(!active);
  };

  const boxRef = useRef();
  const directionalLightRef = useRef();

  return (
    <>
      <Leva hidden />
      <PerfMonitor show={show} position={perf_position} />
      <color attach="background" args={["rgb(242, 242, 242)"]} />
      <Controls
        targetRef={boxRef}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 3}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 2}
        minDistance={1}
        maxDistance={10}
        enableZoom={true}
        lightHelper={Light_Helper}
        directionalLightRef={directionalLightRef}
      />
      <Lights
        ambientLightIntensiity={ambientLightIntensiity}
        directionalLightRef={directionalLightRef}
        position={[positionX, positionY, positionZ]}
        intensity={intensity}
        applySoftShadows={Apply_SoftShadows}
        softShadowsProps={{ size, samples, distance, bias, opacity }}
      />
      <PhysicsWorld debug={PhysicsDebug}>
        <ReactLogo />
        <CardboardBox setLoaded={undefined} ref={boxRef} />
        <Ground />
        <Clipboard
          sceneUrl={'./models/clipboard/scene.gltf'}
          cvTextureUrl={'./cv.jpg'}
          cp_x={cp_x}
          cp_y={cp_y}
          cp_z={cp_z}
          cpr_x={cpr_x}
          cpr_y={cpr_y}
          cpr_z={cpr_z}
          active={active}
          hasDropped={hasDropped}
          setActive={setActive}
          setHasDropped={setHasDropped}
          spring={spring}
          handleClick={handleClick}
        />
      </PhysicsWorld>
    </>
  );
}

export default App