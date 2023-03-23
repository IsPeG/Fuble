import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
const modelsPath = '/src/assets/models'

export default function OldLamp(props, furSize = '1x1') {
  const { nodes, materials } = useGLTF(modelsPath+'/furniture/old_lamp.gltf')
  const spotLightRef = useRef()

  return (
    <>
        <pointLight
            ref={spotLightRef}
            visible={props.options.lightOn}
            angle={1}
            intensity={3}
            position={[props.position[0], .8, props.position[2]]}
            color={'#f7b65c'}
            distance={3}
            castShadow
            shadow-mapSize-height={2048}
            shadow-mapSize-width={2048}
            shadow-radius={10}
            shadow-bias={-0.005}
        /> 
        <group {...props} dispose={null}>
            <mesh geometry={nodes.cylinder.geometry} material={nodes.cylinder.material} receiveShadow castShadow/>
        </group>
    </>
  )
}

useGLTF.preload(modelsPath+'/furniture/old_lamp.gltf')
