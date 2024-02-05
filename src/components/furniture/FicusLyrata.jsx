import React, { useEffect, useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  TextureLoader,
  NearestFilter,
  LinearMipMapLinearFilter,
  sRGBEncoding,
  DoubleSide,
} from "three";

const modelsPath = "/src/assets/models";
const texturePath = "/src/assets/textures/furniture/ficus_lyrata";

export default function FicusLyrata(props) {
  const { nodes, materials } = useGLTF(
    modelsPath + "/furniture/ficus_lyrata.gltf"
  );
  const texture_url = texturePath + `/ficus_lyrata_${props.color}.png`;
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
        castShadow
        receiveShadow
        geometry={nodes.tube.geometry}
      >
        <meshStandardMaterial map={nodes.tube.material.map} side={DoubleSide} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelsPath + "/furniture/ficus_lyrata.gltf");
useTexture.preload(texturePath + `/ficus_lyrata_beige.png`);
useTexture.preload(texturePath + `/ficus_lyrata_orange.png`);
