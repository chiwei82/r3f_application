import { OrbitControls, SoftShadows, useHelper, useGLTF, useTexture, Html } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { Physics, RigidBody } from '@react-three/rapier'
import { useRef, useEffect, useState } from 'react'
import { useControls, Leva } from 'leva'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { AnimatedCrossMaterial } from './materials/CrossShaderMaterial'
import { useSpring, a } from '@react-spring/three'
import './App.css'

function App() {
  
  const cvTexture = useTexture('./cv.jpg')
  const box = useGLTF('./models/Cardboard_Boxes_512.gltf')
  const { scene } = useGLTF('./models/clipboard/scene.gltf')
  const react = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/react-logo/model.gltf')
  
  const box_ref = useRef()
  const clipboard_ref = useRef()
  const directionalLight = useRef()
  const reactRef = useRef()
  const groupRef = useRef()

  const { camera } = useThree()
  const [ loaded, setLoaded ] = useState(false)
  const zoomTarget = 2
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2() 

  useEffect(() => {
    if (cvTexture) {
      cvTexture.anisotropy = 16
      cvTexture.magFilter = THREE.NearestFilter
      cvTexture.minFilter = THREE.LinearMipMapLinearFilter
      cvTexture.encoding = THREE.sRGBEncoding
      cvTexture.needsUpdate = true
    }
  }, [cvTexture])

  useEffect(() => {
    react.scene.traverse((child) => {
      if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
        const mat = child.material
        mat.color.set('red')
        mat.metalness = 0
        mat.roughness = 1
        mat.emissive.set('black')
        mat.needsUpdate = true
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [react])
  
  // leva controls
  const { cp_x, cp_y, cp_z , cpr_x, cpr_y, cpr_z} = useControls('board', {
    cp_x: { value: -0.2, min: -5, max: 5, step: 0.1 },
    cp_y: { value: -1.2, min: -5, max: 5, step: 0.1 },
    cp_z: { value: -0.8, min: -5, max: 5, step: 0.1 },
    cpr_x: { value: -5, min: -10, max: 360, step: Math.PI/360 },
    cpr_y: { value: 0, min: -5, max: 360, step: Math.PI/360  },
    cpr_z: { value: 0, min: -5, max: 360, step: Math.PI/360  },
  })
  
  const { Light_Helper } = useControls('Light', {
    Light_Helper: { value: false }
  })

  const { PhysicsDebug } = useControls('Physics', {
    PhysicsDebug: { value: false }
  })

  const { Apply_SoftShadows, size, samples, distance, bias, opacity } = useControls('SoftShadows', {
    Apply_SoftShadows : { value: true },
    size: { value: 10, min: 0, max: 100, step: 1 },
    samples: { value: 8, min: 0, max: 100, step: 1 },
    distance: { value: 8, min: 0, max: 100, step: 1 },
    bias: { value: -0.0005, min: -1, max: 1, step: 0.0001 },
    opacity: { value: 0.2, min: 0, max: 100, step: 0.1 },
  })

  const { positionX, positionY, positionZ, intensity } = useControls('directionalLight', {
    positionX: { value: -4, min: -5, max: 5, step: 1 },
    positionY: { value: 4, min: -5, max: 10, step: 1 },
    positionZ: { value: 3, min: -5, max: 5, step: 1 },
    intensity: { value: 3, min: 0, max: 10, step: 1 }
  })

  const {ambientLightIntensiity} = useControls('AmbientLight', {
    ambientLightIntensiity: { value: 0.5, min: 0, max: 5, step: 0.1 }
  })

  const { show, perf_position } = useControls('Perf', {
    show: { value: false },
    perf_position: {
      value: 'top-left',
      options: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    }
  })

  useHelper(
    Light_Helper ? directionalLight : null,
    THREE.DirectionalLightHelper,
    0.5,
    'red'
  )

  useEffect(() => {
    if (box.scene) {
      box.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.frustumCulled = false
        }
      })
      setLoaded(true)
    }
  }, [box])

  useFrame(() => {
    if (loaded && camera.zoom < zoomTarget) {
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, zoomTarget, 0.001)
      camera.updateProjectionMatrix()
    }
  })

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  // clipboard detail controls
  const [ active, setActive ] = useState(false)
  const [ hasDropped, setHasDropped ] = useState(false)

  const [ spring, api ] = useSpring(() => ({
    position: [cp_x, cp_y , cp_z],
    rotation: [cpr_x, cpr_y, cpr_z],
    config: { mass: 1, tension: 120, friction: 18 },
  }))

  useEffect(() => {
    if (active) {
      api.start({ 
        position: [ 1, 2.5, 2], 
        rotation: [ Math.PI/6, Math.PI/8 , -Math.PI/12] 
      })
    }
  }, [active])
  
  const handleClick = () => {
    setActive(!active)
  }

  const lastLookPoint = useRef(null)

  useFrame(({ mouse: pointer, camera }) => {
    if (!active) return

    mouse.set(pointer.x, pointer.y)
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(groupRef.current, true)

    if (intersects.length > 0) {
      const target = intersects[0].point
      lastLookPoint.current = target.clone()
    }

    if (lastLookPoint.current) {
      const dir = lastLookPoint.current.clone().sub(camera.position).normalize()
      const currentDir = camera.getWorldDirection(new THREE.Vector3())
      const lerped = currentDir.lerp(dir, 0.05)
      camera.lookAt(camera.position.clone().add(lerped))
    }
  })

  return (
    <>
      <Leva hidden/>
      {show && <Perf position={perf_position} />}
      <color attach="background" args={['rgb(242, 242, 242)']} />
      <OrbitControls 
        target={box_ref.position}
        minPolarAngle={ -Math.PI / 4} // vertical
        maxPolarAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 6} // horizontal
        maxAzimuthAngle={Math.PI / 2}
        minDistance={1}   // ✅ 最小距離（最近 zoom in 到這裡）
        maxDistance={10}  // ✅ 最大距離（最遠 zoom out 不超過這裡，可自行調整）
        enableZoom={true} // 預設就是 true，但寫明可避免誤關
      />
      {/* <OrbitControls/> */}
      <ambientLight intensity={ambientLightIntensiity} />
      <directionalLight 
        castShadow 
        ref={directionalLight} 
        position={[positionX, positionY, positionZ]} 
        intensity={intensity}
      />

      <Physics debug={PhysicsDebug}>

        {/* react logo */}
        <RigidBody 
          colliders="hull"
        >
          <primitive 
              ref={ reactRef } 
              object={ react.scene } 
              position={ [ -0.75, 2, -0.5 ] } 
              scale={ 0.3 } 
          />
        </RigidBody>
        
        {/* cardboard box */}
        <RigidBody type='fixed' colliders="trimesh">
          <primitive 
            ref={box_ref} 
            object={box.scene} 
            scale={4}
            position = {[0,-2,-1]}
          />
        </RigidBody>
        
        {/* plane-Ground */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[100, 100]} />
          <AnimatedCrossMaterial/>
        </mesh>
        {/* shadow：for collect shadow */}
        <RigidBody type='fixed'>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.001, 0]} receiveShadow>
            <planeGeometry args={[60, 60, 5]} />
            <meshStandardMaterial 
              color={'rgb(242, 242, 242)'}
            />
          </mesh>
        </RigidBody>
        
        {/* clipboard */}
        {!active ? (
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
                setActive(true)
                setHasDropped(true)
              }}
            > 
              <Html>
                <div className="content" >
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
              <primitive 
                scale={1.5} 
                ref={clipboard_ref}
                object={scene}
              />
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
            <primitive 
              scale={1.5} 
              object={scene}
            />
          </a.group>
        )}

        {/* external links */}
        

      </Physics>
        
      {/* SoftShadows */}
      {Apply_SoftShadows && 
      <SoftShadows 
        size={ size } 
        samples={ samples } 
        distance={ distance } 
        bias={ bias } 
        opacity={ opacity }  
      />}

    </>
  )
}

export default App