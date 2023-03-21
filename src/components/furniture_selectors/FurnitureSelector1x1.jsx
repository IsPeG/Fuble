import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const modelsPath = '/src/assets/models'

export default function FurnitureSelector1x1(props) {
  const { nodes, materials } = useGLTF(modelsPath+'/furniture_selectors/furnitureSelector1x1.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.cube.geometry} material={nodes.cube.material} />
    </group>
  )
}

useGLTF.preload(modelsPath+'/furniture_selectors/furnitureSelector1x1.gltf')