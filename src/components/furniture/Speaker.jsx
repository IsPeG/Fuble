import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const modelsPath = "/src/assets/models";

export default function Speaker(props) {
  const { nodes, materials } = useGLTF(modelsPath + "/furniture/speaker.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.cube.geometry}
        material={nodes.cube.material}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/speaker.gltf");
