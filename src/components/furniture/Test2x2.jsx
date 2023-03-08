import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const modelsPath = '/src/assets/models'

export default function Test2x2(props) {
  const { nodes, materials } = useGLTF(modelsPath+'/furniture/test2x2.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.cube.geometry} material={nodes.cube.material} />
    </group>
  )
}

useGLTF.preload(modelsPath+'/furniture/test2x2.gltf')
