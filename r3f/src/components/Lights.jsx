import { SoftShadows } from '@react-three/drei';

export default function Lights({
  ambientLightIntensiity,
  directionalLightRef,
  position,
  intensity,
  applySoftShadows,
  softShadowsProps
}) {
  return (
    <>
      <ambientLight intensity={ambientLightIntensiity} />
      <directionalLight
        castShadow
        ref={directionalLightRef}
        position={position}
        intensity={intensity}
      />
      {applySoftShadows && <SoftShadows {...softShadowsProps} />}
    </>
  );
}
