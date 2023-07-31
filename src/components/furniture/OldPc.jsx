import React, { useEffect, useLayoutEffect, useRef, useMemo } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { TextureLoader, NearestFilter, LinearMipMapLinearFilter } from "three";
import { useLoader } from "@react-three/fiber";

const modelsPath = "/src/assets/models";
const texturePath = "/src/assets/textures/furniture/old_pc";

export default function OldPc(props) {
  const { nodes, materials } = useGLTF(modelsPath + "/furniture/old_pc.gltf");

  const texture_url = texturePath + `/old_pc_${props.color}.png`;
  const meshRef = useRef();

  useEffect(() => {
    const loader = new TextureLoader();
    loader.load(texture_url, (t) => {
      console.log(t);
      t.magFilter = NearestFilter;
      t.minFilter = LinearMipMapLinearFilter;
      t.flipY = false; // for one reason, in this model it's necessary to flip the texture in the y axis
      meshRef.current.material.map = t;
    });
  }, [props.color]);

  return (
    <group {...props} dispose={null}>
      <mesh ref={meshRef} geometry={nodes.pc.geometry} castShadow receiveShadow>
        <meshStandardMaterial map={nodes.pc.material.map} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/old_pc.gltf");
useTexture.preload(texturePath + `/old_pc_black.png`);
useTexture.preload(texturePath + `/old_pc_beige.png`);
useTexture.preload(texturePath + `/old_pc_green.png`);
