import * as THREE from 'three'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useGLTF, useHelper } from '@react-three/drei'

const modelsPath = '/src/assets/models'

export default function VendingMachine(props) {
  const { nodes, materials } = useGLTF(modelsPath+'/furniture/vending_machine.gltf')
  const spotLightRef = useRef()

  const south = -Math.PI / 1
  const east = -Math.PI / 2
  const north = 0
  const west = Math.PI / 2
  
  var targetPosition = []

  useEffect(() => {

    switch (props.rotation[1]) {
      case south: targetPosition = [props.position[0], 1, props.position[2]+1]; break; 
      case east:  targetPosition = [props.position[0]+1, 1, props.position[2]]; break;
      case north: targetPosition = [props.position[0], 1, props.position[2]-1]; break;
      case west:  targetPosition = [props.position[0]-1, 1, props.position[2]]; break;
    }

    spotLightRef.current.target.position.set(targetPosition[0], targetPosition[1], targetPosition[2])
    spotLightRef.current.target.updateMatrixWorld()
  }, [])

  return (
    <>
    <spotLight
        ref={spotLightRef}
        angle={1.6}
        intensity={3} 
        position={[props.position[0], 1, props.position[2]]}
        color={'#3debeb'}
        distance={1.4}
        castShadow
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-radius={10}
        shadow-bias={-0.005}
      />  
    <group {...props} dispose={null} receiveShadow>
      <mesh geometry={nodes.main.geometry} material={nodes.main.material} castShadow receiveShadow/>
    </group>
    </>
  )
}

useGLTF.preload(modelsPath+'/furniture/vending_machine.gltf')
