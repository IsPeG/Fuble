import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, extend } from '@react-three/fiber';

// Room elements
import Floor from './components/room_elements/Floor'

// Furniture
import Coach from './components/furniture/Coach'
import Test2x1 from './components/furniture/Test2x1'
import Test2x2 from './components/furniture/Test2x2'
import Plant from './components/furniture/Plant'
import VendingMachine from './components/furniture/VendingMachine'

const componentsMap = {Coach, Test2x2, Test2x1, Plant, VendingMachine}

// Selectors
import FurnitureSelector1x1 from './components/furniture_selectors/FurnitureSelector1x1'
import FurnitureSelector2x1 from './components/furniture_selectors/FurnitureSelector2x1'
import FurnitureSelector2x2 from './components/furniture_selectors/FurnitureSelector2x2'

// UI
import FurMenu from "./components/ui/furMenu";

import "/src/assets/styles/global.css"
import FurSelector from "./components/ui/FurSelector";

// Variables
const south = -Math.PI / 1 //-3.14... down
const west = Math.PI / 2 //1.57... left
const north = 0 // up
const east = -Math.PI / 2 //-1.57... right

const roomDataExample = [
  {key: 1, name: 'Vending machine', model: VendingMachine, position: [3,0,-3], rotation: [0, south, 0], size: '1x1'},
  {key: 2, name: 'Vending machine', model: VendingMachine, position: [2,0,-3], rotation: [0, south, 0], size: '1x1'},
  {key: 3, name: 'Plant', model: Plant, position: [-3,0,3], rotation: [0, east, 0], size: '1x1'},
  {key: 4, name: 'Test2x1', model: Test2x1, position: [-2,0,-2], rotation: [0, west, 0], size: '2x1'},
  {key: 5, name: 'Test2x2', model: Test2x2, position: [2,0,2], rotation: [0, north, 0], size: '2x2'},
  {key: 6, name: 'Coach', model: Coach, position: [1,0,0], rotation: [0, east, 0], size: '1x1'},
  {key: 7, name: 'Coach', model: Coach, position: [0,0,-1], rotation: [0, north, 0], size: '1x1'},
]

import furnitureData from './furnitureData/data.json'

function App() {

  const [roomData, setRoomData] = useState([])
  const [cameraIndex, setCameraIndex] = useState(0)
  const [furMenuOpen, setFurMenuOpen] = useState(false)
  const [selectingFurniture, setSelectingFurniture] = useState(false)
  const cameraIndexRef = useRef
  const [placingFurniture, setPlacingFurniture] = useState(false)
  const [placingFurnitureData, setPlacingFurnitureData] = useState({})
  const setFurnitureHelperRef = useRef()

  const directions = [north, west, south, east]
  const cameraPositions = [[7,7,7], [6.5,6.5,-5.5], [-7,8,-7], [-5.5,6.5,6.5]]
  const lookAtCameraPositions = [[0,0,0], [.5,.5,.5], [-.5,1.5,-.5], [.5,.5,.5]]
  var placingFurnitureDirection = 0

  cameraIndexRef.current = cameraIndex

  useEffect(() => {

    setRoomData(roomDataExample)
    
    const keyHandler = (e) => {
      switch (e.key) {
        case 'ArrowRight': furnitureHelperMoveButtonHandler('right'); break;
        case 'ArrowLeft': furnitureHelperMoveButtonHandler('left'); break;
        case 'ArrowUp': furnitureHelperMoveButtonHandler('up'); break;
        case 'ArrowDown': furnitureHelperMoveButtonHandler('down'); break;
        case 'r': rotateFurnitureButtonHandler('right'); break;
        case 'Escape': setFurMenuOpen(false); break;

        default: break;
      }
    }
    window.addEventListener('keydown', keyHandler)
  }, [])

  console.log(roomData)

  const SetFurnitureHelper = React.forwardRef((props, ref) => {

    const selectorSwitch = () => {
      switch(placingFurnitureData.size) {
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
    if (checkIfFurnitureCanBePlaced(setFurnitureHelperRef.current)) {
      const lastKey = roomData.slice(-1)[0].key;
      setRoomData([...roomData, 
        {
          key: lastKey + 1, 
          model: placingFurnitureData.component, 
          name: placingFurnitureData.name, 
          position: [helperPosition.x, 0, helperPosition.z], 
          rotation: [0, setFurnitureHelperRef.current.rotation.y, 0], 
          size: placingFurnitureData.size
        }
      ]);
      setPlacingFurniture(false);
      placingFurnitureDirection = 0;
    } else {
      console.log('Furniture can\'t be placed in this position')
    }
  }

  const checkIfFurnitureCanBePlaced = (helper) => {

    console.log('placingFurnitureData.size')
    console.log(placingFurnitureData.size)

    const checkSpaces2x2or2x1Item = (element, furType) => {
      let elementSpaces = null

      console.log('KEKEWEKEKWE')
      console.log(element)
      console.log(furType)

      let rotation = element.rotation[1];
      let position = element.position;

      if (rotation == undefined) { // the furniture helper doesn't have rotation as an array, but as an euler
        rotation = element.rotation.y
      } else {
        position = {x: element.position[0], y: element.position[1], z: element.position[2]};
      }

      if (furType == '2x2') { //2x2 furniture
        switch (rotation) {
        case north:
          elementSpaces = [
            [position.x-1, position.y, position.z],
            [position.x, position.y, position.z+1],
            [position.x-1, position.y, position.z+1],
            [position.x, position.y, position.z]
          ];
          break;
        case east:
          elementSpaces = [
            [position.x, position.y, position.z],
            [position.x-1, position.y, position.z-1],
            [position.x-1, position.y, position.z],
            [position.x, position.y, position.z-1]
          ];
          break;
        case south:
          elementSpaces = [
            [position.x, position.y, position.z-1],
            [position.x+1, position.y, position.z],
            [position.x, position.y, position.z],
            [position.x+1, position.y, position.z-1]
          ];
          break;
        case west:
          elementSpaces = [
            [position.x, position.y, position.z],
            [position.x+1, position.y, position.z+1],
            [position.x, position.y, position.z+1],
            [position.x+1, position.y, position.z]
          ];
          break;
        }
      } else if ('2x1') { //2x1 furniture
        switch (rotation) {
          case north:
            elementSpaces = [
              [position.x, position.y, position.z],
              [position.x-1, position.y, position.z]
            ];
            break;
          case east:
            elementSpaces = [
              [position.x, position.y, position.z],
              [position.x, position.y, position.z-1]
            ];
            break;
          case south:
            elementSpaces = [
              [position.x, position.y, position.z],
              [position.x+1, position.y, position.z]
            ];
            break;
          case west:
            elementSpaces = [
              [position.x, position.y, position.z],
              [position.x, position.y, position.z+1]
            ];
            break;
          }
      } else {
        console.log('error')
      }
      
      return elementSpaces;
    } // checkSpaces2x2or2x1Item end

    let canBePlaced = true

    if (placingFurnitureData.size != '1x1') {
      console.log('esto no deberia aparecer')
      const helperSpaces = checkSpaces2x2or2x1Item(helper, placingFurnitureData.size);

      roomData.forEach((furElement) => {
        const furElementSpaces = checkSpaces2x2or2x1Item(furElement, furElement.size);
        console.log('helperSpaces: ' + JSON.stringify(helperSpaces))
        console.log('furElementSpaces: ' + JSON.stringify(furElementSpaces))
        for (let i = 0; i < helperSpaces.length; i++) {
          for (let j = 0; j < furElementSpaces.length; j++) {
            // console.log(helperSpaces[i].toString() + ' == ' + furElementSpaces[j].toString())
            if (helperSpaces[i].toString() == furElementSpaces[j].toString()) {
              canBePlaced = false;
              return;
            }              
          }
        }
      });
    } else {
      console.log('este si xd')
      const helperSpace = [helper.position.x, helper.position.y, helper.position.z];

      roomData.forEach((furElement) => {
        let furElementSpaces = null;
        if (furElement.size == '1x1') {
          furElementSpaces = [furElement.position[0], furElement.position[1], furElement.position[2]];
        } else {
          furElementSpaces = checkSpaces2x2or2x1Item(furElement, furElement.size);
        }
        console.log('helperSpace: ' + JSON.stringify(helperSpace))
        console.log('furElementSpaces: ' + JSON.stringify(furElementSpaces))
        for (let i = 0; i < furElementSpaces.length; i++) {
          // console.log(helperSpaces[i].toString() + ' == ' + furElementSpaces[j].toString())
          if (helperSpace.toString() == furElementSpaces[i].toString()) {
            canBePlaced = false;
            return;
          }              
        }
      });
    }
    
    return canBePlaced;
  }

  const rotateFurnitureButtonHandler = (rotateDirection) => {

    const furnitureHelperPosition = [setFurnitureHelperRef.current.position.x, setFurnitureHelperRef.current.position.z, setFurnitureHelperRef.current.rotation.y]

    if (rotateDirection === 'left') {
      placingFurnitureDirection++
      if (placingFurnitureDirection >= 4) placingFurnitureDirection = 0
    } else {
      placingFurnitureDirection--
      if (placingFurnitureDirection < 0) placingFurnitureDirection = 3
    }

    if (placingFurnitureData.size == '2x2') {
      switch (furnitureHelperPosition[2]) {
        case south: setFurnitureHelperRef.current.position.z -= 1; break;
        case west: setFurnitureHelperRef.current.position.x += 1; break;
        case north: setFurnitureHelperRef.current.position.z += 1; break;
        case east: setFurnitureHelperRef.current.position.x -= 1; break;
      }
    }

    if (placingFurnitureData.size == '2x1') {

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

    const changeMoveFromCameraIndex = (cameraIndex, move) => {

      console.log(placingFurnitureData.size)

      //  left /  \ up
      //  down \  / right

      //when index 0 = moves normal
      //when index 1 (camera right 1) = up > right, right > down, down > left, left > up
      //when index 2 (camera right 2) = up > down, right > left, down > up, left > right
      //when index 3 (camera right 3) = up > left, right > up, down > right, left, down

      let newMove = move;

      switch (cameraIndex) {
        case 1: switch (move) {
          case 'up': newMove = 'left'; break;
          case 'right': newMove = 'up'; break;
          case 'down': newMove = 'right'; break;
          case 'left': newMove = 'down'; break;
        }; break;
        
        case 2: switch (move) {
          case 'up': newMove = 'down'; break;
          case 'right': newMove = 'left'; break;
          case 'down': newMove = 'up'; break;
          case 'left': newMove = 'right'; break;
        }; break;

        case 3: switch (move) {
          case 'up': newMove = 'right'; break;
          case 'right': newMove = 'down'; break;
          case 'down': newMove = 'left'; break;
          case 'left': newMove = 'up'; break;
        }; break;

        default: break;

      }

      return newMove;

    }
    const cameraIndex = cameraIndexRef.current
    const lastPosition = [setFurnitureHelperRef.current.position.x, setFurnitureHelperRef.current.position.z, setFurnitureHelperRef.current.rotation.y]
    let invalidMove = false;

    if (cameraIndex > 0) move = changeMoveFromCameraIndex(cameraIndex, move)
    switch (move) {
      case 'left':
        if (placingFurnitureData.size == '1x1' && lastPosition[0]-1 == -4) invalidMove = true; 
        if (placingFurnitureData.size == '2x1' && lastPosition[0] == -2 && lastPosition[2] == directions[0]) invalidMove = true;
        if (placingFurnitureData.size == '2x2' && ((lastPosition[0] == -2 && lastPosition[2] == directions[3]) || (lastPosition[0] == -2 && lastPosition[2] == directions[0]))) invalidMove = true;
        break;
      case 'right':
        if (placingFurnitureData.size == '1x1' && lastPosition[0]+1 == 5) invalidMove = true;
        if (placingFurnitureData.size == '2x1' && lastPosition[0] == 3 && lastPosition[2] == directions[2]) invalidMove = true;
        if (placingFurnitureData.size == '2x2' && ((lastPosition[0] == 3 && lastPosition[2] == directions[1]) || (lastPosition[0] == 3 && lastPosition[2] == directions[2]))) invalidMove = true;
        break;
      case 'up':
        if (placingFurnitureData.size == '1x1' && lastPosition[1]-1 == -4) invalidMove = true;
        if (placingFurnitureData.size == '2x1' && lastPosition[1] == -2 && lastPosition[2] == directions[3]) invalidMove = true;
        if (placingFurnitureData.size == '2x2' && ((lastPosition[1] == -2 && lastPosition[2] == directions[2]) || (lastPosition[1] == -2 && lastPosition[2] == directions[3]))) invalidMove = true;
        break;
      case 'down':
        if (placingFurnitureData.size == '1x1' && lastPosition[1]+1 == 5) invalidMove = true;
        if (placingFurnitureData.size == '2x1' && lastPosition[1] == 3 && lastPosition[2] == directions[1]) invalidMove = true;
        if (placingFurnitureData.size == '2x2' && ((lastPosition[1] == 3 && lastPosition[2] == directions[0]) || (lastPosition[1] == 3 && lastPosition[2] == directions[1]))) invalidMove = true;
        break;
    }

    if (invalidMove) return;

    switch (move) {
      case 'left':  setFurnitureHelperRef.current.position.x -= 1; break;
      case 'right': setFurnitureHelperRef.current.position.x += 1; break;
      case 'up':    setFurnitureHelperRef.current.position.z -= 1; break;
      case 'down':  setFurnitureHelperRef.current.position.z += 1; break;
    }

  }

  const CameraRig = ({ positionData: [x, y, z], lookAtData: [x2, y2, z2] }) => {
    useFrame((state) => {
      state.camera.position.lerp({ x, y, z }, 0.05)
      state.camera.lookAt(x2, y2, z2)
      state.camera.updateProjectionMatrix()
    })
  }

  const handleFurnitureClick = (e, key, name) => {
    e.stopPropagation();
    setFurMenuOpen({
      x: e.pageX,
      y: e.pageY,
      key: key,
      furName: name.replace(/([A-Z])/g, ' $1').trim()
    })
    //console.log(roomData.find((element) => element.key == key));
  }

  const generateFurMenu = () => {
    return <FurMenu furName={furMenuOpen.furName} x={furMenuOpen.x} y={furMenuOpen.y} refKey={furMenuOpen.key} removeFur={removeFur} />
  }

  const generateSelectingFurniture = () => {
    return <FurSelector handleItemClick={handleItemClick} />
  }
  
  const handleItemClick = (furId) => {
    setSelectingFurniture(false)
    const furSelected = furnitureData.find((element) => element.id == furId)
    setPlacingFurniture(true)
    setPlacingFurnitureData({size: furSelected.size, component: componentsMap[furSelected.name], name: furSelected.name})
  }

  const removeFur = (key) => {
    setRoomData(roomData.filter((element) => element.key != key))
    setFurMenuOpen(false)
  }

  const handleAddFurnitureClick = (e) => {
    setSelectingFurniture(true)
  }

  return (
    <>
      <div className="buttonsContainer">
        <button className="button" onClick={(e) => handleAddFurnitureClick(e)}>Add furniture</button>
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

      { furMenuOpen ?
        generateFurMenu()
      : null }

      { selectingFurniture ?
        generateSelectingFurniture()
      : null }

      <Canvas orthographic camera={{zoom: 100, near: 1, far: 2000}} style={{ background: "#0a0a0a" }}>

        <CameraRig positionData={cameraPositions[cameraIndex]} lookAtData={lookAtCameraPositions[cameraIndex]} />

        <group>
          {roomData.map((furniture) => 
            <furniture.model 
            key={furniture.key} 
            position={furniture.position} 
            rotation={furniture.rotation} 
            size={furniture.size}
            onPointerDown={(e) => handleFurnitureClick(e, furniture.key, furniture.model.name)}
          />)}
        </group>

        <SetFurnitureHelper ref={setFurnitureHelperRef} isPlacing={ placingFurniture ? true : false } />

        <spotLight angle={30} intensity={2} position={[0,5,0]} color={'#ffd187'} distance={40} decay={10} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <ambientLight intensity={0.1} />

        <Floor />

        {/* <gridHelper args={[9, 9, "blue", "blue"]} /> */}
      </Canvas>
    </>
  );
}

export default App;