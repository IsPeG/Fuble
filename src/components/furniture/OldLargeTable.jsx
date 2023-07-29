import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const modelsPath = "/src/assets/models";

export default function OldLargeTable(props) {
  const { nodes, materials } = useGLTF(
    modelsPath + "/furniture/old_large_table.gltf"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.cube.geometry}
        material={nodes.cube.material}
        receiveShadow
        castShadow
      />
      <mesh
        geometry={nodes.plane.geometry}
        material={nodes.plane.material}
        receiveShadow
        castShadow
      />
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/old_large_table.gltf");
