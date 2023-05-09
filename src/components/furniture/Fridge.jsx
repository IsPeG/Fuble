import React, { useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { TextureLoader, NearestFilter, LinearMipMapLinearFilter } from "three";
import { useLoader } from "@react-three/fiber";

const modelsPath = "/src/assets/models";
const texturePath = "/src/assets/textures/furniture/fridge";

export default function Fridge(props) {
  const { nodes, materials } = useGLTF(modelsPath + "/furniture/fridge.gltf");
  const texture_url = texturePath + `/fridge_${props.color}.png`;
  const meshRef = useRef();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(texture_url, (t) => {
      t.magFilter = NearestFilter;
      t.minFilter = LinearMipMapLinearFilter;
      meshRef.current.material.map = t;
    });
  }, [props.color]);

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        geometry={nodes.cube.geometry}
        rotation={[Math.PI, 0, Math.PI]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={nodes.cube.material.map} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/fridge.gltf");
useTexture.preload(texturePath + `/fridge_white.png`);
useTexture.preload(texturePath + `/fridge_yellow.png`);
useTexture.preload(texturePath + `/fridge_green.png`);
