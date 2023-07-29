import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const modelsPath = "/src/assets/models";

export default function OldPc(props) {
  const { nodes, materials } = useGLTF(modelsPath + "/furniture/old_pc.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.pc_1.geometry}
        material={nodes.pc_1.material}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.keyboard.geometry}
        material={nodes.keyboard.material}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.mouse.geometry}
        material={nodes.mouse.material}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={nodes.monitor.geometry}
        material={nodes.monitor.material}
        castShadow
        receiveShadow
      />
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/old_pc.gltf");
