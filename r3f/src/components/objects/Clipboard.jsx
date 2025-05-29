import { RigidBody } from '@react-three/rapier';
import { useGLTF, useTexture, Html } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { a } from '@react-spring/three';
import * as THREE from 'three';

export default function Clipboard({
  sceneUrl,
  cvTextureUrl,
  cp_x, cp_y, cp_z, cpr_x, cpr_y, cpr_z,
  active, hasDropped, setActive, setHasDropped,
  spring, handleClick
}) {
  const clipboardRef = useRef();
  const groupRef = useRef();
  const scene = useGLTF(sceneUrl).scene;
  const cvTexture = useTexture(cvTextureUrl);

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.material && child.material.type === 'MeshBasicMaterial') {
            child.material = new THREE.MeshStandardMaterial({
              color: child.material.color,
              map: child.material.map,
              metalness: 0.4,
              roughness: 0.8,
            });
          }
          if (child.material && child.material.isMeshStandardMaterial) {
            child.material.metalness = 0.4;
            child.material.roughness = 0.8;
            child.material.needsUpdate = true;
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return !active ? (
    <RigidBody
      colliders="hull"
      mass={0.2}
      restitution={0.05}
      friction={1}
      linearDamping={1.5}
      angularDamping={2}
    >
      <group
        position={[cp_x, hasDropped ? cp_y : cp_y + 4, cp_z]}
        rotation={[cpr_x, cpr_y, cpr_z]}
        onClick={() => {
          setActive(true);
          setHasDropped(true);
        }}
      >
        <Html>
          <div className="content">
            curriculum vitae <br /> (Click to see details)
          </div>
        </Html>
        <mesh
          receiveShadow
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.05, 0.17]}
          scale={1.3}
        >
          <planeGeometry args={[0.52, 0.74]} />
          <meshStandardMaterial map={cvTexture} />
        </mesh>
        <primitive scale={1.5} ref={clipboardRef} object={scene} />
      </group>
    </RigidBody>
  ) : (
    <a.group
      ref={groupRef}
      position={spring.position}
      rotation={spring.rotation}
      onClick={handleClick}
      scale={1.6}
    >
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0.17]}
        scale={1.3}
      >
        <planeGeometry args={[0.52, 0.74]} />
        <meshBasicMaterial map={cvTexture} toneMapped={false} />
      </mesh>
      <primitive scale={1.5} object={scene} />
    </a.group>
  );
}
