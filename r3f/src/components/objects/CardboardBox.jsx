import { RigidBody } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';

export default function CardboardBox({ setLoaded }) {
  const box = useGLTF('./models/Cardboard_Boxes_512.gltf');
  const boxRef = useRef();

  useEffect(() => {
    if (box.scene) {
      box.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = false;
        }
      });
      setLoaded && setLoaded(true);
    }
  }, [box, setLoaded]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <primitive ref={boxRef} object={box.scene} scale={4} position={[0, -2, -1]} />
    </RigidBody>
  );
}
