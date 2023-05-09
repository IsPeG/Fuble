import React, { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
// import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { TextureLoader } from "three";
import {
  RepeatWrapping,
  sRGBEncoding,
  NearestFilter,
  LinearMipMapLinearFilter,
  BoxGeometry,
} from "three";

export default function Floor(props) {
  const url = `/src/assets/textures/floor/${props.floorName}/${props.floorName}`;

  const texture = useLoader(TextureLoader, url + ".png");
  const normal = useLoader(TextureLoader, url + "Normal.png");

  // using useMemo because useLoader load the image in some sort of cache keys and this make the app use the same texture reference 2 times
  // in consecuence, this mess with the sizes of the texture (element.repeat.set(sizes[index], sizes[index]))
  const textureCopy = useMemo(() => texture.clone(), [texture]);
  const normalCopy = useMemo(() => normal.clone(), [normal]);

  const textures = [texture, normal, textureCopy, normalCopy];
  const sizes = [8, 8, 2, 2];
  textures.forEach((element, index) => {
    element.repeat.set(sizes[index], sizes[index]);
    element.wrapS = element.wrapT = RepeatWrapping; // tileable image
    element.encoding = sRGBEncoding; // image encoding for better rendering
    element.magFilter = NearestFilter; // pixel perfect
    element.minFilter = LinearMipMapLinearFilter; // pixel perfect
  });

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.5, -0.12, 0.5]}
        receiveShadow
      >
        <boxGeometry attach="geometry" args={[8, 8, 0.25]} />
        <meshPhongMaterial map={textures[0]} normalMap={textures[1]} />;
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.5, -0.12, 5.5]}
        receiveShadow
      >
        <boxGeometry attach="geometry" args={[2, 2, 0.25]} />
        <meshPhongMaterial map={textures[2]} normalMap={textures[3]} />;
      </mesh>
    </>
  );
}
