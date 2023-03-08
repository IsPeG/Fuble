import React from "react";
import { useLoader } from '@react-three/fiber';
// import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { TextureLoader } from 'three'
import { RepeatWrapping, sRGBEncoding, NearestFilter, LinearMipMapLinearFilter, BoxGeometry } from "three";

function Texture () {
    const texture = useLoader(TextureLoader, '/src/assets/textures/floor/wood.png')
    
    texture.repeat.set(8,8);
    texture.wrapS = texture.wrapT = RepeatWrapping; // tileable image
    texture.encoding = sRGBEncoding // image encoding for better rendering
    texture.magFilter = NearestFilter; // pixel perfect
    texture.minFilter = LinearMipMapLinearFilter; // pixel perfect
    
    return (
        <meshStandardMaterial map={texture} />
    )
}

const Floor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[.5, -.13, .5]} receiveShadow>
    <boxBufferGeometry attach="geometry" args={[8, 8, .25]} />
    <Texture />
  </mesh>
);

export default Floor;