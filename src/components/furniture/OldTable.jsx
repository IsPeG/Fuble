import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const modelsPath = '/src/assets/models'

export default function OldTable(props) {
  const { nodes, materials } = useGLTF(modelsPath+'/furniture/old_table.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.mesh_0.geometry} material={nodes.mesh_0.material} receiveShadow castShadow />
      <mesh geometry={nodes.mesh_0_1.geometry} material={nodes.mesh_0_1.material} receiveShadow castShadow />
    </group>
  )
}

useGLTF.preload(modelsPath+'/furniture/old_table.gltf')
