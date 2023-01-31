import * as THREE from 'three'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useGLTF, useHelper } from '@react-three/drei'

export default function Vending_machine(props) {
  const { nodes, materials } = useGLTF('/models/furniture/vending_machine.gltf')
  const spotLightRef = useRef()

  const south = -Math.PI / 1
  const east = -Math.PI / 2
  const north = 0
  const west = Math.PI / 2
  
  var targetPosition = []
  
  switch (props.rotation[1]) {
    case south: targetPosition = [props.position[0], 1, props.position[2]+1]; break; 
    case east:  targetPosition = [props.position[0]+1, 1, props.position[2]]; break;
    case north: targetPosition = [props.position[0], 1, props.position[2]-1]; break;
    case west:  targetPosition = [props.position[0]-1, 1, props.position[2]]; break;
  }

   useEffect(() => {
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
      />  
    <group {...props} dispose={null} receiveShadow>
      <mesh geometry={nodes.main.geometry} material={nodes.main.material} />
    </group>
    </>
  )
}

useGLTF.preload('./models/furniture/vending_machine.gltf')
