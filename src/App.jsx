import React, { useRef, useState, useEffect } from "react";
import { Canvas } from '@react-three/fiber';

// Room elements
import Floor from './components/room_elements/Floor'

// Furniture
import Coach from './components/furniture/Coach'
import Test2x1 from './components/furniture/Test2x1'
import Test2x2 from './components/furniture/Test2x2'
import Plant from './components/furniture/Plant'
import Vending_machine from './components/furniture/Vending_machine'

// Selectors
import FurnitureSelector1x1 from './components/furniture_selectors/FurnitureSelector1x1'
import FurnitureSelector2x1 from './components/furniture_selectors/FurnitureSelector2x1'
import FurnitureSelector2x2 from './components/furniture_selectors/FurnitureSelector2x2'

import "./styles.css"

const south = -Math.PI / 1
const west = Math.PI / 2
const north = 0
const east = -Math.PI / 2

const roomDataExample = [
  {model: Vending_machine, position: [3,0,-3], rotation: [0, south, 0]},
  {model: Vending_machine, position: [2,0,-3], rotation: [0, south, 0]},
  {model: Plant, position: [-3,0,3], rotation: [0, east, 0]},
  {model: Coach, position: [1,0,0], rotation: [0, east, 0]},
  {model: Coach, position: [0,0,-1], rotation: [0, north, 0]},
]

function App() {

  const [roomData, setRoomData] = useState(roomDataExample)
  const [placingFurniture, setPlacingFurniture] = useState(false)
  const [placingFurnitureSize, setPlacingFurnitureSize] = useState('2x1')
  const setFurnitureHelperRef = useRef()

  const directions = [north, west, south, east]
  var placingFurnitureDirection = 0

  useEffect(() => {
    const keyHandler = (e) => {
      switch (e.key) {
        case 'ArrowRight': furnitureHelperMoveButtonHandler('right'); break;
        case 'ArrowLeft': furnitureHelperMoveButtonHandler('left'); break;
        case 'ArrowUp': furnitureHelperMoveButtonHandler('up'); break;
        case 'ArrowDown': furnitureHelperMoveButtonHandler('down'); break;
        case 'r': rotateFurnitureButtonHandler('right'); break;
      
        default: break;
      }
    }
    window.addEventListener('keydown', keyHandler, false)
  }, [])
  

  const SetFurnitureHelper = React.forwardRef((props, ref) => {

    const selectorSwitch = () => {
      switch(placingFurnitureSize) {
        case '1x1': return <FurnitureSelector1x1 />;
        case '2x1': return <FurnitureSelector2x1 />; 
        case '2x2': return <FurnitureSelector2x2 />;
      }
    }

    return (
      <mesh ref={ref} visible={props.isPlacing}>
        {selectorSwitch()}
      </mesh>
    )
  })

  const addFurnitureButtonHandler = () => {
    const helperPosition = setFurnitureHelperRef.current.position;
    setRoomData([...roomData, {model: Test2x1, position: [helperPosition.x, 0, helperPosition.z], rotation: [0, directions[placingFurnitureDirection], 0]}]);
    setPlacingFurniture(false);
    placingFurnitureDirection = 0
  }

  const rotateFurnitureButtonHandler = (rotateDirection) => {
    if (rotateDirection === 'left') {
      placingFurnitureDirection++
      if (placingFurnitureDirection >= 4) placingFurnitureDirection = 0
    } else {
      placingFurnitureDirection--
      if (placingFurnitureDirection < 0) placingFurnitureDirection = 3
    }   

    setFurnitureHelperRef.current.rotation.y = directions[placingFurnitureDirection]
  }

  const furnitureHelperMoveButtonHandler = (move) => {

    const lastPosition = [setFurnitureHelperRef.current.position.x, setFurnitureHelperRef.current.position.z]
    let invalidMove = false

    switch (move) {
      case 'left':  if (lastPosition[0]-1 == -4) invalidMove = true; break;
      case 'right': if (lastPosition[0]+1 == 5) invalidMove = true; break;
      case 'up':    if (lastPosition[1]-1 == -4) invalidMove = true; break;
      case 'down':  if (lastPosition[1]+1 == 5) invalidMove = true; break;
    }

    if (invalidMove) return;

    switch (move) {
      case 'left':  setFurnitureHelperRef.current.position.x -= 1; break;
      case 'right': setFurnitureHelperRef.current.position.x += 1; break;
      case 'up':    setFurnitureHelperRef.current.position.z -= 1; break;
      case 'down':  setFurnitureHelperRef.current.position.z += 1; break;
    }
  }

  return (
    <>
      <div className="buttonsContainer">
        <button className="button" onClick={() => setPlacingFurniture(!placingFurniture)}>Add furniture</button>

        {placingFurniture ? 
          <div className="movesContainer">
            <button onClick={(e) => furnitureHelperMoveButtonHandler('left', e)}>ᐊ</button>
            <button onClick={(e) => furnitureHelperMoveButtonHandler('right', e)}>ᐅ</button>
            <button onClick={(e) => furnitureHelperMoveButtonHandler('up', e)}>ᐃ</button>
            <button onClick={(e) => furnitureHelperMoveButtonHandler('down', e)}>ᐁ</button>
            <button onClick={(e) => rotateFurnitureButtonHandler('left', e)}>ROTATE LEFT</button>
            <button onClick={(e) => rotateFurnitureButtonHandler('right', e)}>ROTATE RIGHT</button>
            <button onClick={(e) => addFurnitureButtonHandler()}>Set</button>
          </div>
          : null
        }
        
      </div>
      
      <Canvas orthographic camera={{ position: [7,7,7], zoom: 100 }} style={{ background: "#0a0a0a" }} dpr={[1, 2]}>
        <group>
          {roomData.map((furniture, key) => <furniture.model key={key} position={furniture.position} rotation={furniture.rotation} />)}
        </group>

        <SetFurnitureHelper ref={setFurnitureHelperRef} isPlacing={ placingFurniture ? true : false } />
        <spotLight angle={30} intensity={2} position={[0,5,0]} color={'#ffd187'} distance={40} decay={10} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <ambientLight intensity={0.1} />
        <Floor />
        
        {/* <gridHelper args={[7, 7, "blue", "blue"]} /> */}
      </Canvas>
    </>
  );
}

export default App;