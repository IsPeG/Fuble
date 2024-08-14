import React, { useMemo, useState, useEffect } from "react";
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

import floorsData from "../../_floorsData/data.json";

export default function Floor(props) {
  const floor = floorsData.find((elem) => elem.id == props.floorId);
  const url = `/src/assets/textures/floor/${floor.name}/floor`;

  const texture = useLoader(TextureLoader, url + ".png");
  const normal = useLoader(TextureLoader, url + "_n.png");

  // using useMemo because useLoader load the image in some sort of cache keys and this make the app use the same texture reference 2 times
  // in consecuence, this mess with the sizes of the texture (element.repeat.set(sizes[index], sizes[index]))
  const textureCopy = useMemo(() => texture.clone(), [texture]);
  const normalCopy = useMemo(() => normal.clone(), [normal]);

  const textures = [texture, normal, textureCopy, normalCopy];
  const sizes = floor.type == "tiled" ? [8, 8, 2, 2] : [1, 1, 2, 2];

  if (floor.type == "full") {
    const exit = useLoader(TextureLoader, url + "_exit.png");
    const exitNormal = useLoader(TextureLoader, url + "_exit_n.png");

    textures[2] = exit;
    textures[3] = exitNormal;
  }

  // console.log(sizes);

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
        <boxGeometry attach="geometry" args={[8, 8, 0.25]} />;
        <meshPhongMaterial //top material
          attach="material-4"
          map={textures[0]}
          normalMap={textures[1]}
        />
        ;
        <meshPhongMaterial
          attach="material-0"
          map={textures[2]}
          normalMap={textures[3]}
        />
        ;
        <meshPhongMaterial
          attach="material-1"
          map={textures[2]}
          normalMap={textures[3]}
        />
        ;
        <meshPhongMaterial
          attach="material-2"
          map={textures[2]}
          normalMap={textures[3]}
        />
        ;
        <meshPhongMaterial
          attach="material-3"
          map={textures[2]}
          normalMap={textures[3]}
        />
        ;
        <meshPhongMaterial
          attach="material-5"
          map={textures[2]}
          normalMap={textures[3]}
        />
        ;
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
