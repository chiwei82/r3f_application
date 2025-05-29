import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { Suspense } from 'react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Canvas 
      shadows
      camera={{ 
        position: [2, 4, 4],
        fov: 60,
        zoom: 1
      }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </Canvas>
    <Loader />
  </StrictMode>,
)
