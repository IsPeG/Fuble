import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const modelsPath = '/src/assets/models'

export default function OldWardrobe(props) {
  const { nodes, materials } = useGLTF(modelsPath+'/furniture/old_wardrobe.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.cube.geometry} material={nodes.cube.material} receiveShadow castShadow />
    </group>
  )
}

useGLTF.preload(modelsPath+'/furniture/old_wardrobe.gltf')
