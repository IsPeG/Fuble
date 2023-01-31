import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function FurnitureSelector2x1(props) {
  const { nodes, materials } = useGLTF('/models/furniture_selectors/furnitureSelector2x1.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.cube.geometry} material={nodes.cube.material} />
    </group>
  )
}

useGLTF.preload('./models/furniture_selectors/furnitureSelector2x1.gltf')
