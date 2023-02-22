import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from '@react-three/fiber';

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

// Variables
const south = -Math.PI / 1 //-3.14...
const west = Math.PI / 2 //1.57...
const north = 0
const east = -Math.PI / 2 //-1.57...

const roomDataExample = [
  {model: Vending_machine, position: [3,0,-3], rotation: [0, south, 0]},
  {model: Vending_machine, position: [2,0,-3], rotation: [0, south, 0]},
  {model: Plant, position: [-3,0,3], rotation: [0, east, 0]},
  {model: Coach, position: [1,0,0], rotation: [0, east, 0]},
  {model: Coach, position: [0,0,-1], rotation: [0, north, 0]},
]

function App() {

  const [roomData, setRoomData] = useState(roomDataExample)
  const [cameraIndex, setCameraIndex] = useState(0)
  const [placingFurniture, setPlacingFurniture] = useState(false)
  const [placingFurnitureSize, setPlacingFurnitureSize] = useState('2x2')
  const setFurnitureHelperRef = useRef()

  const directions = [north, west, south, east]
  const cameraPositions = [[7,7,7], [6.5,6.5,-5.5], [-7,8,-7], [-5.5,6.5,6.5]]
  const lookAtCameraPositions = [[0,0,0], [.5,.5,.5], [-.5,1.5,-.5], [.5,.5,.5]]
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
    setRoomData([...roomData, {model: Test2x2, position: [helperPosition.x, 0, helperPosition.z], rotation: [0, setFurnitureHelperRef.current.rotation.y, 0]}]);
    setPlacingFurniture(false);
    placingFurnitureDirection = 0;
  }

  const rotateFurnitureButtonHandler = (rotateDirection) => {

    const furnitureHelperPosition = [setFurnitureHelperRef.current.position.x, setFurnitureHelperRef.current.position.z, setFurnitureHelperRef.current.rotation.y]
    console.log('-r-' + furnitureHelperPosition)

    if (rotateDirection === 'left') {
      placingFurnitureDirection++
      if (placingFurnitureDirection >= 4) placingFurnitureDirection = 0
    } else {
      placingFurnitureDirection--
      if (placingFurnitureDirection < 0) placingFurnitureDirection = 3
    }

    if (placingFurnitureSize == '2x2') {
      switch (furnitureHelperPosition[2]) {
        case south: setFurnitureHelperRef.current.position.z -= 1; break;
        case west: setFurnitureHelperRef.current.position.x += 1; break;
        case north: setFurnitureHelperRef.current.position.z += 1; break;
        case east: setFurnitureHelperRef.current.position.x -= 1; break;
      }
    }

    if (placingFurnitureSize == '2x1') {

      let blockedRotation = false

      if (furnitureHelperPosition[1] == -3 && placingFurnitureDirection == 3 ) { //top right
        placingFurnitureDirection = 2;
        setFurnitureHelperRef.current.position.x -= 1;
        blockedRotation = true;
      }

      if (furnitureHelperPosition[0] == -3 && placingFurnitureDirection == 0 && !blockedRotation) { //top left
        placingFurnitureDirection = 3;
        setFurnitureHelperRef.current.position.z += 1;
        blockedRotation = true;
      }

      if (furnitureHelperPosition[0] == 4 && placingFurnitureDirection == 2 && !blockedRotation) { //bottom right
        placingFurnitureDirection = 1;
        setFurnitureHelperRef.current.position.z -= 1;
        blockedRotation = true;
      }

      if (furnitureHelperPosition[1] == 4 && placingFurnitureDirection == 1 && !blockedRotation) { //bottom left
        placingFurnitureDirection = 0;
        setFurnitureHelperRef.current.position.x += 1;
      }
    }

    setFurnitureHelperRef.current.rotation.y = directions[placingFurnitureDirection]
  }

  const changeCameraPosition = (move) => {

    let index = cameraIndex

    if (move === 'right') {
      index++
      if (index >= 4) index = 0
    } else if (move === 'left') {
      index--
      if (index < 0) index = 3
    }
    
    setCameraIndex(index)

  }

  const furnitureHelperMoveButtonHandler = (move) => {

    const lastPosition = [setFurnitureHelperRef.current.position.x, setFurnitureHelperRef.current.position.z, setFurnitureHelperRef.current.rotation.y]
    let invalidMove = false;

    console.log(move)
    console.log('from ' + lastPosition + ' - ' + setFurnitureHelperRef.current.rotation.y)

    switch (move) {
      case 'left':
        if (lastPosition[0]-1 == -4) invalidMove = true;
        if (placingFurnitureSize == '2x1' && lastPosition[0] == -2 && lastPosition[2] == directions[0]) invalidMove = true;
        if (placingFurnitureSize == '2x2' && (lastPosition[0] == -2 && lastPosition[2] == directions[3]) || (lastPosition[0] == -2 && lastPosition[2] == directions[0])) invalidMove = true;
        break;
      case 'right':
        if (lastPosition[0]+1 == 5) invalidMove = true;
        if (placingFurnitureSize == '2x1' && lastPosition[0] == 3 && lastPosition[2] == directions[2]) invalidMove = true;
        if (placingFurnitureSize == '2x2' && (lastPosition[0] == 3 && lastPosition[2] == directions[1]) || (lastPosition[0] == 3 && lastPosition[2] == directions[2])) invalidMove = true;
        break;
      case 'up':
        if (lastPosition[1]-1 == -4) invalidMove = true;
        if (placingFurnitureSize == '2x1' && lastPosition[1] == -2 && lastPosition[2] == directions[3]) invalidMove = true;
        if (placingFurnitureSize == '2x2' && (lastPosition[1] == -2 && lastPosition[2] == directions[2]) || (lastPosition[1] == -2 && lastPosition[2] == directions[3])) invalidMove = true;
        break;
      case 'down':
        if (lastPosition[1]+1 == 5) invalidMove = true;
        if (placingFurnitureSize == '2x1' && lastPosition[1] == 3 && lastPosition[2] == directions[1]) invalidMove = true;
        if (placingFurnitureSize == '2x2' && (lastPosition[1] == 3 && lastPosition[2] == directions[0]) || (lastPosition[1] == 3 && lastPosition[2] == directions[1])) invalidMove = true;
        break;
    }

    if (invalidMove) return;

    switch (move) {
      case 'left':  setFurnitureHelperRef.current.position.x -= 1; break;
      case 'right': setFurnitureHelperRef.current.position.x += 1; break;
      case 'up':    setFurnitureHelperRef.current.position.z -= 1; break;
      case 'down':  setFurnitureHelperRef.current.position.z += 1; break;
    }

    console.log('to ' + [setFurnitureHelperRef.current.position.x, setFurnitureHelperRef.current.position.z] + ' - ' + setFurnitureHelperRef.current.rotation.y)

  }

  function CameraRig({ positionData: [x, y, z], lookAtData: [x2, y2, z2] }) {
    useFrame((state) => {
      state.camera.position.lerp({ x, y, z }, 0.05)
      state.camera.lookAt(x2, y2, z2)
      state.camera.updateProjectionMatrix()
    })
  }

  return (
    <>
      <div className="buttonsContainer">
        <button className="button" onClick={(e) => setPlacingFurniture(!placingFurniture, e)}>Add furniture</button>
        <button className="button" onClick={(e) => changeCameraPosition('left', e)}>Camera left</button>
        <button className="button" onClick={(e) => changeCameraPosition('right', e)}>Camera right</button>

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

      <Canvas orthographic camera={{zoom: 100, near: 1, far: 2000}} style={{ background: "#0a0a0a" }}>

        <CameraRig positionData={cameraPositions[cameraIndex]} lookAtData={lookAtCameraPositions[cameraIndex]} />

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