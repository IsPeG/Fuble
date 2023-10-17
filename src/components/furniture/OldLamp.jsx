import React, { useRef } from "react";
import { useGLTF, useHelper } from "@react-three/drei";
const modelsPath = "/src/assets/models";
import { PointLightHelper } from "three";

export default function OldLamp(props) {
  const { nodes, materials } = useGLTF(modelsPath + "/furniture/old_lamp.gltf");
  const spotLightRef = useRef();

  // useHelper(spotLightRef, PointLightHelper, 0.5);

  return (
    <>
      <pointLight
        ref={spotLightRef}
        visible={props.options.lightOn}
        intensity={3}
        position={[props.position[0], props.position[1] + 2, props.position[2]]}
        color={"#f7b65c"}
        distance={10}
        castShadow
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-radius={10}
        shadow-bias={-0.005}
      />
      <group {...props} dispose={null}>
        <mesh
          geometry={nodes.cylinder.geometry}
          material={nodes.cylinder.material}
          castShadow={false}
          receiveShadow={true}
        />
      </group>
    </>
  );
}

useGLTF.preload(modelsPath + "/furniture/old_lamp.gltf");
