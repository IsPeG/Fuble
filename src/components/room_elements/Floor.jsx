import React from "react";
import { useLoader } from '@react-three/fiber';
// import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { TextureLoader } from 'three'
import { RepeatWrapping, sRGBEncoding, NearestFilter, LinearMipMapLinearFilter, BoxGeometry } from "three";



export default function Floor (props) {

  const url = `/src/assets/textures/floor/${props.floorName}/${props.floorName}`

  function Texture () {
    const texture = useLoader(TextureLoader, url+'.png')
    const normal = useLoader(TextureLoader, url+'Normal.png')

    const textures = [texture, normal] 
    
    textures.forEach(element => {
      element.repeat.set(8,8);
      element.wrapS = element.wrapT = RepeatWrapping; // tileable image
      element.encoding = sRGBEncoding // image encoding for better rendering
      element.magFilter = NearestFilter; // pixel perfect
      element.minFilter = LinearMipMapLinearFilter; // pixel perfect
    });
    
    return (
        <meshPhongMaterial map={texture} normalMap={normal} />
    )
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[.5, -.13, .5]} receiveShadow>
      <boxBufferGeometry attach="geometry" args={[8, 8, .25]} />
      <Texture />
    </mesh>
  )
}
