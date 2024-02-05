import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const modelsPath = "/src/assets/models";

export default function SmallCactaceae(props) {
  const { nodes, materials } = useGLTF(
    modelsPath + "/furniture/small_cactaceae.gltf"
  );
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.sphere.geometry}
        material={nodes.sphere.material}
      />
    </group>
  );
}

useGLTF.preload("/small_cactaceae.gltf");
