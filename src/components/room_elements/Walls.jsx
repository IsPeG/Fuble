import React from "react";
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

import wallsData from "../../_wallsData/data.json";

export default function Walls(props) {
  const south = -Math.PI / 1; //-3.14... down
  const west = Math.PI / 2; //1.57... left
  const north = 0; // up
  const east = -Math.PI / 2; //-1.57... right

  const planeGeometryArgs = [8, 3.5];

  const wallName = [];

  // console.log(props.wallIds);

  wallName.push(wallsData.find((elem) => elem.id == props.wallIds[0]).name);
  wallName.push(wallsData.find((elem) => elem.id == props.wallIds[2]).name);
  wallName.push(wallsData.find((elem) => elem.id == props.wallIds[3]).name);
  wallName.push(wallsData.find((elem) => elem.id == props.wallIds[1]).name);

  const url1 = `/src/assets/textures/walls/${wallName[0]}/`;
  const url2 = `/src/assets/textures/walls/${wallName[1]}/`;
  const url3 = `/src/assets/textures/walls/${wallName[2]}/`;
  const url4 = `/src/assets/textures/walls/${wallName[3]}/`;

  const texture1 = useLoader(TextureLoader, url1 + "1.png");
  const normal1 = useLoader(TextureLoader, url1 + "n1.png");
  const texture2 = useLoader(TextureLoader, url2 + "2.png");
  const normal2 = useLoader(TextureLoader, url2 + "n2.png");
  const texture3 = useLoader(TextureLoader, url3 + "3.png");
  const normal3 = useLoader(TextureLoader, url3 + "n3.png");
  const texture4 = useLoader(TextureLoader, url4 + "3.png");
  const normal4 = useLoader(TextureLoader, url4 + "n3.png");

  const textures = [
    texture1,
    texture2,
    texture3,
    texture4,
    normal1,
    normal2,
    normal3,
    normal4,
  ];

  textures.forEach((element) => {
    element.repeat.set(1, 1);
    element.wrapS = element.wrapT = RepeatWrapping; // tileable image
    element.encoding = sRGBEncoding; // image encoding for better rendering
    element.magFilter = NearestFilter; // pixel perfect
    element.minFilter = LinearMipMapLinearFilter; // pixel perfect
  });

  return (
    <group>
      <mesh
        position={[0.5, 1.7, -3.5]}
        rotation={[0, north, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry attach="geometry" args={planeGeometryArgs} />
        <meshPhongMaterial
          attach="material"
          map={texture1}
          normalMap={normal1}
        />
      </mesh>
      <mesh
        position={[-3.5, 1.7, 0.5]}
        rotation={[0, west, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry attach="geometry" args={planeGeometryArgs} />
        <meshPhongMaterial
          attach="material"
          map={texture3}
          normalMap={normal3}
        />
      </mesh>
      <mesh
        position={[0.5, 1.7, 4.5]}
        rotation={[0, south, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry attach="geometry" args={planeGeometryArgs} />
        <meshPhongMaterial
          attach="material"
          map={texture2}
          normalMap={normal2}
          transparent
        />
      </mesh>
      <mesh
        position={[4.5, 1.7, 0.5]}
        rotation={[0, east, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry attach="geometry" args={planeGeometryArgs} />
        <meshPhongMaterial
          attach="material"
          map={texture4}
          normalMap={normal4}
        />
      </mesh>
    </group>
  );
}
