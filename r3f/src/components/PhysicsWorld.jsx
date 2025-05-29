import { Physics } from '@react-three/rapier';

export default function PhysicsWorld({ debug, children }) {
  return (
    <Physics debug={debug}>
      {children}
    </Physics>
  );
}
