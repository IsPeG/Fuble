import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const modelsPath = "/src/assets/models";

export default function Fridge(props) {
  const { nodes, materials } = useGLTF(modelsPath + "/furniture/fridge.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.cube.geometry}
        material={nodes.cube.material}
        rotation={[Math.PI, 0, Math.PI]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/fridge.gltf");
