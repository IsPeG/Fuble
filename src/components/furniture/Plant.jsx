import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Plant(props) {
  const { nodes, materials } = useGLTF('/models/furniture/plant.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.tube.geometry} material={nodes.tube.material} />
    </group>
  )
}

useGLTF.preload('./models/furniture/plant.gltf')
