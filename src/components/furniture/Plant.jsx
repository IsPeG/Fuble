import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const modelsPath = '/src/assets/models'

export default function Plant(props) {
  const { nodes, materials } = useGLTF(modelsPath+'/furniture/plant.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.tube.geometry} material={nodes.tube.material} />
    </group>
  )
}

useGLTF.preload(modelsPath+'/furniture/plant.gltf')
