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
const texturePath = "/src/assets/textures/furniture/croton";

useGLTF.preload(modelsPath + "/furniture/croton.gltf");
useTexture.preload(texturePath + `/croton_amberglow.png`);
useTexture.preload(texturePath + `/croton_blue.png`);
useTexture.preload(texturePath + `/croton_brown.png`);
useTexture.preload(texturePath + `/croton_crimson.png`);
useTexture.preload(texturePath + `/croton_green.png`);

export default function Croton(props) {
  const { nodes, materials } = useGLTF(modelsPath + "/furniture/croton.gltf");

  const texture_url = texturePath + `/croton_${props.color}.png`;
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
        geometry={nodes.croton.geometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          map={nodes.croton.material.map}
          side={DoubleSide} // DoubleSide makes the texture visible also for the inner surfaces of the model
        />
      </mesh>
    </group>
  );
}
