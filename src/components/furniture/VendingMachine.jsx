import * as THREE from "three";
import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useGLTF, useHelper } from "@react-three/drei";

const modelsPath = "/src/assets/models";

export default function VendingMachine(props) {
  const { nodes, materials } = useGLTF(
    modelsPath + "/furniture/vending_machine.gltf"
  );
  const VendingMachineLightRef = useRef();
  const [lightPos, setLightPos] = useState([]);

  const south = -Math.PI / 1;
  const east = -Math.PI / 2;
  const north = 0;
  const west = Math.PI / 2;

  useEffect(() => {
    switch (props.rotation[1]) {
      case south:
        setLightPos([props.position[0], 1, props.position[2] + 0.5]);
        break;
      case east:
        setLightPos([props.position[0] + 0.5, 1, props.position[2]]);
        break;
      case north:
        setLightPos([props.position[0], 1, props.position[2] - 0.5]);
        break;
      case west:
        setLightPos([props.position[0] - 0.5, 1, props.position[2]]);
        break;
    }
  }, []);

  useHelper(VendingMachineLightRef, THREE.PointLightHelper, "red");

  return (
    <>
      <pointLight
        ref={VendingMachineLightRef}
        visible={props.options.lightOn}
        intensity={3}
        position={lightPos}
        color={"#3debeb"}
        distance={1.3}
        castShadow
        shadow-mapSize-height={2048}
        shadow-mapSize-width={2048}
        shadow-radius={10}
        shadow-bias={-0.005}
      />
      <group {...props} dispose={null}>
        <mesh
          geometry={nodes.main.geometry}
          material={nodes.main.material}
          castShadow
          receiveShadow
        />
      </group>
    </>
  );
}

useGLTF.preload(modelsPath + "/furniture/vending_machine.gltf");
