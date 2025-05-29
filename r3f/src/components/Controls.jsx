import { OrbitControls } from '@react-three/drei';
import { useHelper } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

export default function Controls({
  targetRef,
  minPolarAngle,
  maxPolarAngle,
  minAzimuthAngle,
  maxAzimuthAngle,
  minDistance,
  maxDistance,
  enableZoom,
  lightHelper,
  directionalLightRef,
  zoomTarget = 2,
  initialCameraPosition = [2, 4, 4],
  loaded = true
}) {
  const { camera } = useThree();
  const [initialized, setInitialized] = useState(false);

  useHelper(
    lightHelper ? directionalLightRef : null,
    THREE.DirectionalLightHelper,
    0.5,
    'red'
  );

  useEffect(() => {
    if (!initialized) {
      camera.position.set(...initialCameraPosition);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      setInitialized(true);
    }
  }, [camera, initialized, initialCameraPosition]);

  useFrame(() => {
    if (loaded && camera.zoom < zoomTarget) {
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, zoomTarget, 0.001);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <OrbitControls
      target={targetRef?.current?.position || [0, 0, 0]}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      minAzimuthAngle={minAzimuthAngle}
      maxAzimuthAngle={maxAzimuthAngle}
      minDistance={minDistance}
      maxDistance={maxDistance}
      enableZoom={enableZoom}
    />
  );
}
