import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Test2x2(props) {
  const { nodes, materials } = useGLTF('/models/furniture/test2x2.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.cube.geometry} material={nodes.cube.material} />
    </group>
  )
}

useGLTF.preload('./models/furniture/test2x2.gltf')
