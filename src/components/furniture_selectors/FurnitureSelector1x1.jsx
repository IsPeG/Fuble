import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function FurnitureSelector1x1(props) {
  const { nodes, materials } = useGLTF('/models/furniture_selectors/furnitureSelector1x1.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.tube.geometry} material={nodes.tube.material} />
    </group>
  )
}

useGLTF.preload('./models/furniture_selectors/furnitureSelector1x1.gltf')
