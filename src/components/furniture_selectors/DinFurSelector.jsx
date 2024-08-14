import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

const modelsPath = "/src/assets/models";

export default function DinFurSelector(props) {
  const { nodes, materials } = useGLTF(
    modelsPath +
      `/furniture_selectors/furnitureSelector${props.name || "1x1"}.gltf`
  );
  return (
    <group {...props} dispose={null}>
      <props.placingFurnitureData.component isBeingPlaced={true} />
      <mesh
        geometry={nodes.tube_selection.geometry}
        material={nodes.tube_selection.material}
      />
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture_selectors/furnitureSelector1x1.gltf");
useGLTF.preload(modelsPath + "/furniture_selectors/furnitureSelector1x2.gltf");
useGLTF.preload(modelsPath + "/furniture_selectors/furnitureSelector2x2.gltf");
