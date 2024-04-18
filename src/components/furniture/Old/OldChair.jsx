import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const modelsPath = "/src/assets/models";

export default function OldChair(props) {
  const { nodes, materials } = useGLTF(
    modelsPath + "/furniture/old_chair.gltf"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.cube.geometry}
        material={nodes.cube.material}
        receiveShadow
        castShadow
      />
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/old_chair.gltf");
