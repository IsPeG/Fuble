import React from "react";
import { useLoader } from '@react-three/fiber';
// import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { TextureLoader } from 'three'
import { RepeatWrapping, sRGBEncoding, NearestFilter, LinearMipMapLinearFilter, BoxGeometry } from "three";

export default function Walls (props) {

    const south = -Math.PI / 1 //-3.14... down
    const west = Math.PI / 2 //1.57... left
    const north = 0 // up
    const east = -Math.PI / 2 //-1.57... right

    const url = `/src/assets/textures/walls/${props.wallName}/${props.wallName}`

    const texture1 = useLoader(TextureLoader, url+'1.png')
    const normal1 =  useLoader(TextureLoader, url+'Normal1.png')
    const texture2 = useLoader(TextureLoader, url+'2.png')
    const normal2 =  useLoader(TextureLoader, url+'Normal2.png')
    const texture3 = useLoader(TextureLoader, url+'3.png')
    const normal3 =  useLoader(TextureLoader, url+'Normal3.png')

    const textures = [texture1, texture2, texture3, normal1, normal2, normal3]

    textures.forEach(element => {
        element.repeat.set(1,1);
        element.wrapS = element.wrapT = RepeatWrapping; // tileable image
        element.encoding = sRGBEncoding // image encoding for better rendering
        element.magFilter = NearestFilter; // pixel perfect
        element.minFilter = LinearMipMapLinearFilter; // pixel perfect
    });
    
    return (
      <group>
        <mesh position={[.5,1.5,-3.5]} rotation={[0,north,0]} castShadow receiveShadow>
          <planeBufferGeometry attach="geometry" args={[8, 3]} />
          <meshPhongMaterial attach="material" map={texture1} normalMap={normal1} />
        </mesh>
        <mesh position={[-3.5,1.5,.5]} rotation={[0,west,0]} castShadow receiveShadow>
          <planeBufferGeometry attach="geometry" args={[8, 3]} />
          <meshPhongMaterial attach="material" map={texture3} normalMap={normal3} />
        </mesh>
        <mesh position={[.5,1.5,4.5]} rotation={[0,south,0]} castShadow receiveShadow>
          <planeBufferGeometry attach="geometry" args={[8, 3]} />
          <meshPhongMaterial attach="material" map={texture2} normalMap={normal2} />
        </mesh>
        <mesh position={[4.5,1.5,.5]} rotation={[0,east,0]} castShadow receiveShadow>
          <planeBufferGeometry attach="geometry" args={[8, 3]} />
          <meshPhongMaterial attach="material" map={texture3} normalMap={normal3} />
        </mesh>
      </group>
    )
}