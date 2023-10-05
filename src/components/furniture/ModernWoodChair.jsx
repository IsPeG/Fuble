import React, { useEffect, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  TextureLoader,
  NearestFilter,
  LinearMipMapLinearFilter,
  sRGBEncoding,
} from "three";

const modelsPath = "/src/assets/models";
const texturePath = "/src/assets/textures/furniture/modern_wood_chair";

export default function ModernWoodChair(props) {
  const { nodes, materials } = useGLTF(
    modelsPath + "/furniture/modern_wood_chair.gltf"
  );

  const texture_url = texturePath + `/modern_wood_chair_${props.color}.png`;
  const meshRef = useRef();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(texture_url, (t) => {
      t.magFilter = NearestFilter;
      t.minFilter = LinearMipMapLinearFilter;
      t.encoding = sRGBEncoding;

      t.flipY = false; // for some reason, in this model it's necessary to flip the texture in the y axis
      meshRef.current.material.map = t;
    });
  }, [props.color]);

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        geometry={nodes.cube.geometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial map={nodes.cube.material.map} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/modern_wood_chair.gltf");
useTexture.preload(texturePath + `/modern_wood_chair_oak.png`);
useTexture.preload(texturePath + `/modern_wood_chair_orange.png`);
