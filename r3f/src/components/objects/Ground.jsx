import { RigidBody } from '@react-three/rapier';
import { AnimatedCrossMaterial } from '../../materials/CrossShaderMaterial';

export default function Ground() {
  return (
    <>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100]} />
        <AnimatedCrossMaterial />
      </mesh>
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.001, 0]} receiveShadow>
          <planeGeometry args={[80, 80, 5]} />
          <meshStandardMaterial color={'rgb(242, 242, 242)'} />
        </mesh>
      </RigidBody>
    </>
  );
}
