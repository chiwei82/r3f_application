import { RigidBody } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';

export default function ReactLogo() {
  const react = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/react-logo/model.gltf');
  const reactRef = useRef();

  useEffect(() => {
    if (react.scene) {
      react.scene.traverse((child) => {
        if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
          const mat = child.material;
          mat.color.set('red');
          mat.metalness = 0;
          mat.roughness = 1;
          mat.emissive.set('black');
          mat.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [react]);

  return (
    <RigidBody colliders="hull">
      <primitive ref={reactRef} object={react.scene} position={[-0.75, 2, -0.5]} scale={0.3} />
    </RigidBody>
  );
}
