import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  SpotLight,
  useDepthBuffer,
  useHelper,
  OrbitControls,
} from "@react-three/drei";
// import { Edges } from "@react-three/drei";

// Room elements
import Floor from "./components/room_elements/Floor";
import Walls from "./components/room_elements/Walls";

// Furniture
import * as FURNITURE from "./components/furniture/_models_index.js";
import componentsMap from "./components/furniture/_componentsMap.js";

// Selectors
import FurnitureSelector1x1 from "./components/furniture_selectors/FurnitureSelector1x1";
import FurnitureSelector2x1 from "./components/furniture_selectors/FurnitureSelector2x1";
import FurnitureSelector2x2 from "./components/furniture_selectors/FurnitureSelector2x2";
import DinFurSelector from "./components/furniture_selectors/DinFurSelector";

// UI
import FurMenu from "./components/ui/FurMenu/FurMenu";
import SaveRoomMenu from "./components/ui/SaveRoomMenu/SaveRoomMenu";
import ChangeWallsFloorMenu from "./components/ui/ChangeWallsFloorMenu/ChangeWallsFloorMenu";
import Options from "./components/ui/Options/Options";

import "./assets/styles/global.css";
import FurSelector from "./components/ui/FurSelector/FurSelector";
import { furniturePlacedSound, playButtonHoverSound } from "./sounds";

// Variables
const south = -Math.PI / 1; //-3.14... down
const west = Math.PI / 2; //1.57... left
const north = 0; // up
const east = -Math.PI / 2; //-1.57... right

const RoomDataExample = {
  furniture: [
    // {
    //   key: 1,
    //   name: "Test2x2",
    //   model: FURNITURE.Test2x2,
    //   position: [-0.5, 0, 0.5],
    //   rotation: [0, north, 0],
    //   size: "2x2",
    //   color: "oak",
    //   options: {},
    //   furProps: ["surface"],
    // },
  ],
  walls: [6, 6, 6, 6],
  floor: 1,
};

import furnitureData from "./_furnitureData/data.json";

function App() {
  const [cameraIndex, setCameraIndex] = useState(0);
  const [roomDataFurniture, setRoomDataFurniture] = useState([]);
  const [roomDataWalls, setRoomDataWalls] = useState([]);
  const [freeCamera, setFreeCamera] = useState(false);
  const [roomDataFloor, setRoomDataFloor] = useState(0);
  const [furMenuOpen, setFurMenuOpen] = useState(false);
  const [saveRoomMenuOpen, setSaveRoomMenuOpen] = useState(false);
  const [changeWallsFloorMenuOpen, setChangeWallsFloorMenuOpen] =
    useState(false);
  const [selectingFurniture, setSelectingFurniture] = useState(false);
  const [placingFurniture, setPlacingFurniture] = useState(false);
  const [placingFurnitureData, setPlacingFurnitureData] = useState({});
  // const [debugHelperColisions, setDebugHelperColisions] = useState([]) // DEBUG
  const setFurnitureHelperRef = useRef();
  const cameraIndexRef = useRef();
  const buttonsContainerRef = useRef();
  const rotateCameraRightRef = useRef();
  const rotateCameraLeftRef = useRef();
  const zoomLevelRef = useRef();

  const directions = [north, west, south, east];
  // const cameraPositions = [[7,6,7], [6.5,5.5,-5.5], [-7,7,-7], [-5.5,5.5,6.5]]
  // const lookAtCameraPositions = [[0,0,0], [.5,.5,.5], [-.5,1.5,-.5], [.5,.5,.5]]
  const cameraPositions = [
    [7, 6, 7],
    [7, 5, 0.5], //
    [6.5, 5.5, -5.5],
    [0.5, 4.5, -5.3], //
    [-7, 7, -7],
    [-7.5, 6, 0.5], //
    [-5.5, 5.5, 6.5],
    [0.5, 4.6, 6.5], //
  ];
  const lookAtCameraPositions = [
    [0, 0, 0],
    [0, 0, 0.5], //
    [0.5, 0.5, 0.5],
    [0.5, 0, 1], //
    [-0.5, 1.5, -0.5],
    [-0.5, 1.07, 0.5], //
    [0.5, 0.5, 0.5],
    [0.5, 0.7, 1], //
  ];

  var placingFurnitureDirection = 0;

  cameraIndexRef.current = cameraIndex;
  console.log("hola");
  console.log(zoomLevelRef.current);

  useEffect(() => {
    // load example room data
    setRoomDataFurniture(RoomDataExample.furniture);
    setRoomDataWalls(RoomDataExample.walls);
    setRoomDataFloor(RoomDataExample.floor);

    const keyHandler = (e) => {
      // e.preventDefault();
      if (e.target.type == "text" && e.key != "Escape") {
        return;
      }
      switch (e.key) {
        case "ArrowRight":
        case "d":
          // furnitureHelperMoveButtonHandler("right", e);
          document.getElementById("moveFurRight")
            ? document.getElementById("moveFurRight").click()
            : null;
          break;
        case "ArrowLeft":
        case "a":
          // furnitureHelperMoveButtonHandler("left", e);
          document.getElementById("moveFurLeft")
            ? document.getElementById("moveFurLeft").click()
            : null;
          break;
        case "ArrowUp":
        case "w":
          // furnitureHelperMoveButtonHandler("up", e);
          document.getElementById("moveFurUp")
            ? document.getElementById("moveFurUp").click()
            : null;
          break;
        case "ArrowDown":
        case "s":
          // furnitureHelperMoveButtonHandler("down", e);
          document.getElementById("moveFurDown")
            ? document.getElementById("moveFurDown").click()
            : null;
          break;
        case "r":
          document.getElementById("rotateFur")
            ? document.getElementById("rotateFur").click()
            : null;
          break;
        case "q":
          document.getElementById("rotateCameraLeft")
            ? document.getElementById("rotateCameraLeft").click()
            : null;
          break;
        case "e":
          document.getElementById("rotateCameraRight")
            ? document.getElementById("rotateCameraRight").click()
            : null;
          break;
        case " ": //spacebar
          document.getElementById("placeFur")
            ? document.getElementById("placeFur").click()
            : null;
          break;
        case "Escape":
          escKeyHandler();
          break;

        default:
          break;
      }
    };
    window.addEventListener("keydown", keyHandler);
    //prevent user from using right click on the app
    document.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    // const buttons = document.querySelectorAll("button");
    // buttons.forEach((element) => {
    //   element.addEventListener("click", () => {
    //     buttonHoverSound.pause();
    //     buttonHoverSound.currentTime = 0;
    //     buttonHoverSound.play();º
    //   });
    // });
  }, []);

  console.log(roomDataFurniture);

  const escKeyHandler = () => {
    setFurMenuOpen(false);
    setSelectingFurniture(false);
    setChangeWallsFloorMenuOpen(false);
    setSaveRoomMenuOpen(false);
    setPlacingFurniture(false);
    setPlacingFurniture(false);
    const confMenus = document.querySelectorAll(
      ".confirmationMenuBackground button.red"
    );
    confMenus[0].click();
  };

  const SetFurnitureHelper = React.forwardRef((props, ref) => {
    const selectorSwitch = () => {
      switch (placingFurnitureData.size) {
        // case "1x1":
        //   return <FurnitureSelector1x1 name={"1x1"} />;
        // case "2x1":
        //   return <FurnitureSelector2x1 name={"2x1"} />;
        // case "2x2":
        //   return <FurnitureSelector2x2 name={"2x2"} />;
        case "1x1":
          return (
            <DinFurSelector
              placingFurnitureData={placingFurnitureData}
              name={"1x1"}
            />
          );
        case "2x1":
          return (
            <DinFurSelector
              placingFurnitureData={placingFurnitureData}
              name={"2x1"}
            />
          );
        case "2x2":
          return (
            <DinFurSelector
              placingFurnitureData={placingFurnitureData}
              name={"2x2"}
            />
          );
      }
    };

    if (props.isPlacing) changeHeightOfHelper();

    return (
      <mesh
        ref={ref}
        visible={props.isPlacing}
        position={ref.current?.position || [0, 0, 0]}
      >
        {selectorSwitch()}
      </mesh>
    );
  });

  const addFurnitureButtonHandler = () => {
    const helperPosition = setFurnitureHelperRef.current.position;
    const canBePlaced = checkIfFurnitureCanBePlaced(
      setFurnitureHelperRef.current
    );
    if (canBePlaced != "no") {
      const lastKey = roomDataFurniture.slice(-1)[0]?.key ?? 0;

      let furOptions = {};
      for (const elem of placingFurnitureData.furProps) {
        console.log(elem);
        switch (elem) {
          case "light":
            furOptions.lightOn = true;
            break;
          case "colors":
            furOptions.colors = placingFurnitureData.colors;
            break;
          default:
            break;
        }
      }

      let newFurYAxis = 0;
      if (canBePlaced == "surface") newFurYAxis = 1.05;
      if (canBePlaced == "lowerSurface") newFurYAxis = 0.55;
      console.log("xdxd");
      console.log(newFurYAxis);
      setRoomDataFurniture([
        ...roomDataFurniture,
        {
          key: lastKey + 1,
          model: placingFurnitureData.component,
          name: placingFurnitureData.name,
          position: [helperPosition.x, newFurYAxis, helperPosition.z],
          rotation: [0, setFurnitureHelperRef.current.rotation.y, 0],
          size: placingFurnitureData.size,
          furProps: placingFurnitureData.furProps,
          color: furOptions.colors?.[0] || null,
          options: furOptions,
        },
      ]);
      setPlacingFurniture(false);
      // new Audio(furniturePlacedSound).play();
      furniturePlacedSound.play();
      placingFurnitureDirection = 0;
    } else {
      console.log("Furniture can't be placed in this position");
    }
  };

  const checkSpaces2x2or2x1Item = (element, furType) => {
    let elementSpaces = null;
    let isHelper = false;

    let rotation = element.rotation[1];
    let position = element.position;

    if (rotation == undefined) {
      // the furniture helper doesn't have rotation as an array, but as an euler
      rotation = element.rotation.y;
      isHelper = true;
    } else {
      position = {
        x: element.position[0],
        y: element.position[1],
        z: element.position[2],
      };
    }

    if (furType == "2x2") {
      //2x2 furniture
      switch (rotation) {
        case north:
          elementSpaces = [
            //inside spaces
            [position.x - 1, position.y, position.z],
            [position.x, position.y, position.z + 1],
            [position.x - 1, position.y, position.z + 1],
            [position.x, position.y, position.z],

            [position.x - 0.5, position.y, position.z + 0.5],
            [position.x - 1, position.y, position.z + 0.5],
            [position.x - 0.5, position.y, position.z],
            [position.x - 0.5, position.y, position.z + 1],
            [position.x, position.y, position.z + 0.5],
          ];
          if (isHelper) {
            elementSpaces.push(
              [position.x - 1.5, position.y, position.z - 0.5],
              [position.x - 1.5, position.y, position.z],
              [position.x - 1.5, position.y, position.z + 0.5],
              [position.x - 1.5, position.y, position.z + 1],
              [position.x - 1.5, position.y, position.z + 1.5],

              [position.x - 1, position.y, position.z + 1.5],
              [position.x - 0.5, position.y, position.z + 1.5],
              [position.x, position.y, position.z + 1.5],
              [position.x + 0.5, position.y, position.z + 1.5],

              [position.x + 0.5, position.y, position.z - 0.5],
              [position.x + 0.5, position.y, position.z],
              [position.x + 0.5, position.y, position.z + 0.5],
              [position.x + 0.5, position.y, position.z + 1],

              [position.x - 1, position.y, position.z - 0.5],
              [position.x - 0.5, position.y, position.z - 0.5],
              [position.x, position.y, position.z - 0.5]
            );
          }
          break;
        case east:
          elementSpaces = [
            //inside spaces
            [position.x - 0.5, position.y, position.z - 0.5],
            [position.x, position.y, position.z - 0.5],
            [position.x - 0.5, position.y, position.z],
            [position.x - 0.5, position.y, position.z - 1],
            [position.x - 1, position.y, position.z - 0.5],

            [position.x, position.y, position.z],
            [position.x - 1, position.y, position.z - 1],
            [position.x - 1, position.y, position.z],
            [position.x, position.y, position.z - 1],
          ];
          if (isHelper) {
            elementSpaces.push(
              [position.x - 1.5, position.y, position.z - 1.5],
              [position.x - 1.5, position.y, position.z - 1],
              [position.x - 1.5, position.y, position.z - 0.5],
              [position.x - 1.5, position.y, position.z],
              [position.x - 1.5, position.y, position.z + 0.5],

              [position.x - 1, position.y, position.z + 0.5],
              [position.x - 0.5, position.y, position.z + 0.5],
              [position.x, position.y, position.z + 0.5],
              [position.x + 0.5, position.y, position.z + 0.5],

              [position.x + 0.5, position.y, position.z - 1],
              [position.x + 0.5, position.y, position.z - 0.5],
              [position.x + 0.5, position.y, position.z],
              [position.x - 1, position.y, position.z - 1.5],

              [position.x + 0.5, position.y, position.z - 1.5],
              [position.x, position.y, position.z - 1.5],
              [position.x - 0.5, position.y, position.z - 1.5]
            );
          }
          break;
        case south:
          elementSpaces = [
            //inside spaces
            [position.x + 0.5, position.y, position.z - 0.5],
            [position.x + 1, position.y, position.z - 0.5],
            [position.x + 0.5, position.y, position.z],
            [position.x + 0.5, position.y, position.z - 1],
            [position.x, position.y, position.z - 0.5],

            [position.x, position.y, position.z - 1],
            [position.x + 1, position.y, position.z],
            [position.x, position.y, position.z],
            [position.x + 1, position.y, position.z - 1],
          ];
          if (isHelper) {
            elementSpaces.push(
              [position.x + 1.5, position.y, position.z + 0.5],
              [position.x + 1.5, position.y, position.z],
              [position.x + 1.5, position.y, position.z - 0.5],
              [position.x + 1.5, position.y, position.z - 1],
              [position.x + 1.5, position.y, position.z - 1.5],

              [position.x + 1, position.y, position.z - 1.5],
              [position.x + 0.5, position.y, position.z - 1.5],
              [position.x, position.y, position.z - 1.5],
              [position.x - 0.5, position.y, position.z - 1.5],

              [position.x - 0.5, position.y, position.z + 0.5],
              [position.x - 0.5, position.y, position.z],
              [position.x - 0.5, position.y, position.z - 0.5],
              [position.x - 0.5, position.y, position.z - 1],

              [position.x + 1, position.y, position.z + 0.5],
              [position.x + 0.5, position.y, position.z + 0.5],
              [position.x, position.y, position.z + 0.5]
            );
          }
          break;
        case west:
          elementSpaces = [
            //inside spaces
            [position.x + 0.5, position.y, position.z + 0.5],
            [position.x, position.y, position.z + 0.5],
            [position.x + 0.5, position.y, position.z],
            [position.x + 0.5, position.y, position.z + 1],
            [position.x + 1, position.y, position.z + 0.5],

            [position.x, position.y, position.z],
            [position.x + 1, position.y, position.z + 1],
            [position.x + 1, position.y, position.z],
            [position.x, position.y, position.z + 1],
          ];
          if (isHelper) {
            elementSpaces.push(
              [position.x + 1.5, position.y, position.z + 1.5],
              [position.x + 1.5, position.y, position.z + 1],
              [position.x + 1.5, position.y, position.z + 0.5],
              [position.x + 1.5, position.y, position.z],
              [position.x + 1.5, position.y, position.z - 0.5],

              [position.x + 1, position.y, position.z - 0.5],
              [position.x + 0.5, position.y, position.z - 0.5],
              [position.x, position.y, position.z - 0.5],
              [position.x - 0.5, position.y, position.z - 0.5],

              [position.x - 0.5, position.y, position.z + 1],
              [position.x - 0.5, position.y, position.z + 0.5],
              [position.x - 0.5, position.y, position.z],
              [position.x + 1, position.y, position.z + 1.5],

              [position.x - 0.5, position.y, position.z + 1.5],
              [position.x, position.y, position.z + 1.5],
              [position.x + 0.5, position.y, position.z + 1.5]
            );
          }
          break;
      }
    } else if ("2x1") {
      //2x1 furniture
      switch (rotation) {
        case north:
          elementSpaces = [
            //inside spaces
            [position.x, position.y, position.z], //interior spaces
            [position.x - 1, position.y, position.z],
            [position.x - 0.5, position.y, position.z],
          ];
          if (isHelper) {
            elementSpaces.push(
              //surrounding spaces
              [position.x + 0.5, position.y, position.z], // tight sides
              [position.x - 1.5, position.y, position.z],

              [position.x + 0.5, position.y, position.z + 0.5], //wide side 1
              [position.x, position.y, position.z + 0.5],
              [position.x - 0.5, position.y, position.z + 0.5],
              [position.x - 1, position.y, position.z + 0.5],
              [position.x - 1.5, position.y, position.z + 0.5],

              [position.x + 0.5, position.y, position.z - 0.5], //wide side 2
              [position.x, position.y, position.z - 0.5],
              [position.x - 0.5, position.y, position.z - 0.5],
              [position.x - 1, position.y, position.z - 0.5],
              [position.x - 1.5, position.y, position.z - 0.5]
            );
          }
          break;
        case east:
          elementSpaces = [
            [position.x, position.y, position.z],
            [position.x, position.y, position.z - 1],
            [position.x, position.y, position.z - 0.5],
          ];
          if (isHelper) {
            elementSpaces.push(
              [position.x, position.y, position.z + 0.5],
              [position.x, position.y, position.z - 1.5],

              [position.x + 0.5, position.y, position.z + 0.5],
              [position.x + 0.5, position.y, position.z],
              [position.x + 0.5, position.y, position.z - 0.5],
              [position.x + 0.5, position.y, position.z - 1],
              [position.x + 0.5, position.y, position.z - 1.5],

              [position.x - 0.5, position.y, position.z + 0.5],
              [position.x - 0.5, position.y, position.z],
              [position.x - 0.5, position.y, position.z - 0.5],
              [position.x - 0.5, position.y, position.z - 1],
              [position.x - 0.5, position.y, position.z - 1.5]
            );
          }
          break;
        case south:
          elementSpaces = [
            [position.x, position.y, position.z],
            [position.x + 1, position.y, position.z],
            [position.x + 0.5, position.y, position.z],
          ];
          if (isHelper) {
            elementSpaces.push(
              [position.x - 0.5, position.y, position.z],
              [position.x + 1.5, position.y, position.z],

              [position.x - 0.5, position.y, position.z + 0.5],
              [position.x, position.y, position.z + 0.5],
              [position.x + 0.5, position.y, position.z + 0.5],
              [position.x + 1, position.y, position.z + 0.5],
              [position.x + 1.5, position.y, position.z + 0.5],

              [position.x - 0.5, position.y, position.z - 0.5],
              [position.x, position.y, position.z - 0.5],
              [position.x + 0.5, position.y, position.z - 0.5],
              [position.x + 1, position.y, position.z - 0.5],
              [position.x + 1.5, position.y, position.z - 0.5]
            );
          }
          break;
        case west:
          elementSpaces = [
            [position.x, position.y, position.z],
            [position.x, position.y, position.z + 1],
            [position.x, position.y, position.z + 0.5],
          ];
          if (isHelper) {
            elementSpaces.push(
              [position.x, position.y, position.z - 0.5],
              [position.x, position.y, position.z + 1.5],

              [position.x + 0.5, position.y, position.z - 0.5],
              [position.x + 0.5, position.y, position.z],
              [position.x + 0.5, position.y, position.z + 0.5],
              [position.x + 0.5, position.y, position.z + 1],
              [position.x + 0.5, position.y, position.z + 1.5],

              [position.x - 0.5, position.y, position.z - 0.5],
              [position.x - 0.5, position.y, position.z],
              [position.x - 0.5, position.y, position.z + 0.5],
              [position.x - 0.5, position.y, position.z + 1],
              [position.x - 0.5, position.y, position.z + 1.5]
            );
          }
          break;
      }
    } else {
      console.log("error");
    }

    // setDebugHelperColisions(elementSpaces)
    return elementSpaces;
  };

  const checkIfThereIsFurnitureClose = (helperPositions, surfaceProps) => {
    let furYAxis = 0;
    let canBePlaced = true;
    if (surfaceProps.includes("lowerSurface")) furYAxis = 0.55;
    if (surfaceProps.includes("surface")) furYAxis = 1.05;

    roomDataFurniture.forEach((furElement) => {
      console.log(furYAxis);
      console.log(furElement.position[1]);
      if (furElement.position[1] == furYAxis) {
        for (let i = 0; i < helperPositions.length; i++) {
          console.log(furElement.position.toString());
          console.log(helperPositions[i].toString());
          if (
            furElement.position[0] == helperPositions[i][0] &&
            furElement.position[2] == helperPositions[i][2]
          ) {
            console.log("choca con algun mueble");
            canBePlaced = false;
            return canBePlaced;
          }
        }
      }
    });
    return canBePlaced;
  };

  const checkIfFurnitureCanBePlaced = (helper) => {
    let canBePlaced = "floor";
    helper.visible = false;
    const previousY = helper.position.y;
    helper.position.y = 0;

    if (placingFurnitureData.size != "1x1") {
      // if the placing furniture is not 1x1
      const helperSpaces = checkSpaces2x2or2x1Item(
        helper,
        placingFurnitureData.size
      );

      roomDataFurniture.forEach((furElement) => {
        let furElementSpaces = null;
        if (furElement.size == "1x1") {
          furElementSpaces = [
            furElement.position[0],
            furElement.position[1],
            furElement.position[2],
          ];
          for (let i = 0; i < helperSpaces.length; i++) {
            console.log(
              helperSpaces[i].toString(),
              furElementSpaces.toString()
            );
            console.log(
              helperSpaces[i].toString() == furElementSpaces.toString()
            );
            if (helperSpaces[i].toString() == furElementSpaces.toString()) {
              console.log("no1");
              canBePlaced = "no";
              return;
            }
          }
        } else {
          furElementSpaces = checkSpaces2x2or2x1Item(
            furElement,
            furElement.size
          );
        }
        for (let i = 0; i < helperSpaces.length; i++) {
          for (let j = 0; j < furElementSpaces.length; j++) {
            if (helperSpaces[i].toString() == furElementSpaces[j].toString()) {
              console.log("no2");
              canBePlaced = "no";
              return;
            }
          }
        }
      });
    } else {
      // if the placing furniture is 1x1
      const helperSpace = [
        [helper.position.x, helper.position.y, helper.position.z],
        [helper.position.x + 0.5, helper.position.y, helper.position.z],
        [helper.position.x - 0.5, helper.position.y, helper.position.z],
        [helper.position.x, helper.position.y, helper.position.z + 0.5],
        [helper.position.x, helper.position.y, helper.position.z - 0.5],
        [helper.position.x + 0.5, helper.position.y, helper.position.z - 0.5],
        [helper.position.x - 0.5, helper.position.y, helper.position.z - 0.5],
        [helper.position.x + 0.5, helper.position.y, helper.position.z + 0.5],
        [helper.position.x - 0.5, helper.position.y, helper.position.z + 0.5],
      ];

      roomDataFurniture.forEach((furElement) => {
        if (canBePlaced != "floor") return;
        let furElementSpaces = null;

        if (furElement.size == "1x1") {
          furElementSpaces = [
            furElement.position[0],
            furElement.position[1],
            furElement.position[2],
          ];

          console.log("---");
          console.log(helperSpace, furElementSpaces);

          if (
            furElement.furProps.includes("surface") &&
            placingFurnitureData.furProps.includes("canBePlacedOnSurface")
          ) {
            if (helperSpace[0].toString() == furElementSpaces.toString()) {
              if (
                !checkIfThereIsFurnitureClose(helperSpace, furElement.furProps)
              ) {
                // if 1x1 surface have fur on top, it wont let you place another fur on the same position
                canBePlaced = "no";
                return;
              }
              console.log("hola hola 3");
              canBePlaced = "surface";
              return;
            }
          } else if (
            furElement.furProps.includes("lowerSurface") &&
            placingFurnitureData.furProps.includes("canBePlacedOnSurface")
          ) {
            if (helperSpace[0].toString() == furElementSpaces.toString()) {
              console.log("hola hola 2");
              canBePlaced = "lowerSurface";
              return;
            }
          } else if (
            furElement.furProps.includes("canBePlacedOnSurface") &&
            placingFurnitureData.furProps.includes("canBePlacedOnSurface")
          ) {
            helperSpace.forEach((elem) => (elem[1] = 1.1));
            for (let i = 0; i < helperSpace.length; i++) {
              if (helperSpace[i].toString() == furElementSpaces.toString()) {
                console.log("ha entrao 1");
                canBePlaced = "no";
                return;
              }
            }
            helperSpace.forEach((elem) => (elem[1] = helper.position.y));
          }
          for (let i = 0; i < helperSpace.length; i++) {
            if (helperSpace[i].toString() == furElementSpaces.toString()) {
              console.log("ha entrao 2");
              canBePlaced = "no";
              return;
            }
          }
        } else {
          furElementSpaces = checkSpaces2x2or2x1Item(
            furElement,
            furElement.size
          );
          console.log("helperSpace + furElementSpaces: ");
          console.log(helperSpace, furElementSpaces);

          const surfaceSpaces = furElement.size == "2x1" ? 3 : 9;
          for (let i = 0; i < furElementSpaces.length + 1; i++) {
            console.log(i);
            if (surfaceSpaces == 3) {
              if (i == 0) {
                for (let j = 0; j < 9; j++) {
                  for (let k = 0; k < 3; k++) {
                    if (
                      helperSpace[j].toString() ==
                      furElementSpaces[k].toString()
                    ) {
                      canBePlaced = "no";
                    }
                  }
                }
              }
              if (
                furElement.furProps.includes("surface") &&
                placingFurnitureData.furProps.includes("canBePlacedOnSurface")
              ) {
                for (let j = 0; j < 3; j++) {
                  console.log(helperSpace[0].toString());
                  console.log(furElementSpaces[j].toString());
                  if (
                    helperSpace[0].toString() == furElementSpaces[j].toString()
                  ) {
                    if (
                      checkIfThereIsFurnitureClose(
                        helperSpace,
                        furElement.furProps
                      )
                    ) {
                      canBePlaced = "surface";
                      return;
                    }
                  }
                  // else {
                  //   for (let k = 0; k < 6; k++) {
                  //     console.log("ha entrao 3");
                  //     // This was a no before, changing it to floor seems to fix the bug.
                  //     // BUG: If a surface 2x1 was in the room and the user tried to place a lamp (for ex.) on the floor, it throws a canBePlaced = "no"
                  //   }
                  // }
                }
              } else if (
                furElement.furProps.includes("lowerSurface") &&
                placingFurnitureData.furProps.includes("canBePlacedOnSurface")
              ) {
                for (let j = 0; j < 3; j++) {
                  console.log("son estos");
                  console.log(helperSpace[0].toString());
                  console.log(furElementSpaces[j].toString());
                  if (
                    helperSpace[0].toString() == furElementSpaces[j].toString()
                  ) {
                    console.log("ha entrao 4 a");
                    if (
                      checkIfThereIsFurnitureClose(
                        helperSpace,
                        furElement.furProps
                      )
                    ) {
                      canBePlaced = "lowerSurface";
                      return;
                    }
                  } else {
                    console.log("ha entrao 4 b");
                    if (
                      !checkIfThereIsFurnitureClose(
                        helperSpace,
                        furElement.furProps
                      )
                    ) {
                      canBePlaced = "no";
                      return;
                    }
                  }
                }
              } else if (
                furElement.furProps.includes("canBePlacedOnSurface") &&
                placingFurnitureData.furProps.includes("canBePlacedOnSurface")
              ) {
                helperSpace.forEach((elem) => (elem[1] = 1.1)); //maybe this has to be 1 and not 1.1
                for (let j = 0; j < helperSpace.length; j++) {
                  if (
                    helperSpace[j].toString() == furElementSpaces[i].toString()
                  ) {
                    console.log("ha entrao 5");
                    canBePlaced = "no";
                    return;
                  }
                }
                helperSpace.forEach((elem) => (elem[1] = helper.position.y));
              }
            } else {
              for (let j = 0; j < 9; j++) {
                for (let k = 0; k < 9; k++) {
                  if (
                    helperSpace[j].toString() == furElementSpaces[k].toString()
                  ) {
                    canBePlaced = "no";
                  }
                }
              }
              for (let j = 0; j < 9; j++) {
                if (
                  helperSpace[0].toString() == furElementSpaces[j].toString()
                ) {
                  console.log("ha entrao 6");
                  if (
                    checkIfThereIsFurnitureClose(
                      helperSpace,
                      furElement.furProps
                    )
                  ) {
                    canBePlaced = "surface";
                    return;
                  } else {
                    canBePlaced = "no";
                  }
                }
              }
              // for (let k = 0; k < helperSpace.length; k++) {
              //   for (let l = 0; l < furElementSpaces.length; l++) {
              //     if (
              //       helperSpace[k].toString() != furElementSpaces[l].toString()
              //     ) {
              //       console.log("fiumba");
              //       canBePlaced = "floor";
              //     } else {
              //       console.log("nop");
              //       canBePlaced = "no";
              //       return;
              //     }
              //   }
              // }
            }
          }
        }
      });
    }
    console.log("ha llegado al final");
    console.log(canBePlaced);
    helper.visible = true;
    helper.position.y = previousY;

    return canBePlaced;
  };

  const rotateFurnitureButtonHandler = () => {
    const furnitureHelperPosition = [
      setFurnitureHelperRef.current.position.x,
      setFurnitureHelperRef.current.position.z,
      setFurnitureHelperRef.current.rotation.y,
    ];

    const placingFurnitureSize = setFurnitureHelperRef.current.children[0].name;

    console.log(
      setFurnitureHelperRef.current.position.x,
      setFurnitureHelperRef.current.position.z,
      setFurnitureHelperRef.current.rotation.y,
      placingFurnitureDirection
    );

    placingFurnitureDirection--;
    if (placingFurnitureDirection < 0) placingFurnitureDirection = 3;

    if (placingFurnitureSize == "2x2") {
      switch (furnitureHelperPosition[2]) {
        case south:
          setFurnitureHelperRef.current.position.z -= 1;
          break;
        case west:
          setFurnitureHelperRef.current.position.x += 1;
          break;
        case north:
          setFurnitureHelperRef.current.position.z += 1;
          break;
        case east:
          setFurnitureHelperRef.current.position.x -= 1;
          break;
      }
    }

    if (placingFurnitureSize == "2x1") {
      // const directions = [north, west, south, east];

      // const south = -Math.PI / 1; //-3.14... down
      // const west = Math.PI / 2; //1.57... left
      // const north = 0; // up
      // const east = -Math.PI / 2; //-1.57... right

      let blockedRotation = false;

      if (furnitureHelperPosition[1] == -3 && placingFurnitureDirection == 3) {
        //top right
        placingFurnitureDirection = 2;
        setFurnitureHelperRef.current.position.x -= 1;
        blockedRotation = true;
      }

      if (
        furnitureHelperPosition[0] == -3 &&
        placingFurnitureDirection == 0 &&
        !blockedRotation
      ) {
        //top left
        placingFurnitureDirection = 3;
        setFurnitureHelperRef.current.position.z += 1;
        blockedRotation = true;
      }

      if (
        furnitureHelperPosition[0] == 4 &&
        placingFurnitureDirection == 2 &&
        !blockedRotation
      ) {
        //bottom right
        placingFurnitureDirection = 1;
        setFurnitureHelperRef.current.position.z -= 1;
        blockedRotation = true;
      }

      if (
        furnitureHelperPosition[1] == 4 &&
        placingFurnitureDirection == 1 &&
        !blockedRotation
      ) {
        //bottom left
        placingFurnitureDirection = 0;
        setFurnitureHelperRef.current.position.x += 1;
        blockedRotation = true;
      }

      if (
        furnitureHelperPosition[0] == 3.5 &&
        placingFurnitureDirection == 2 &&
        !blockedRotation
      ) {
        placingFurnitureDirection = 1;
        setFurnitureHelperRef.current.position.z -= 1;
        blockedRotation = true;
      }

      if (
        furnitureHelperPosition[1] == 3.5 &&
        placingFurnitureDirection == 1 &&
        !blockedRotation
      ) {
        placingFurnitureDirection = 0;
        setFurnitureHelperRef.current.position.x += 1;
        blockedRotation = true;
      }

      if (
        furnitureHelperPosition[1] == -2.5 &&
        placingFurnitureDirection == 3 &&
        !blockedRotation
      ) {
        placingFurnitureDirection = 2;
        setFurnitureHelperRef.current.position.x -= 1;
        blockedRotation = true;
      }

      if (
        furnitureHelperPosition[0] == -2.5 &&
        placingFurnitureDirection == 0 &&
        !blockedRotation
      ) {
        placingFurnitureDirection = 3;
        setFurnitureHelperRef.current.position.z += 1;
        blockedRotation = true;
      }
    }

    setFurnitureHelperRef.current.rotation.y =
      directions[placingFurnitureDirection];
  };

  const changeCameraPosition = (move) => {
    let index = cameraIndex;

    if (move === "right") {
      index++;
      if (index >= 8) index = 0;
    } else if (move === "left") {
      index--;
      if (index < 0) index = 7;
    }
    console.log(index);
    setCameraIndex(index);
  };

  const furnitureHelperMoveButtonHandler = (move, size) => {
    const changeMoveFromCameraIndex = (cameraIndex, move) => {
      //  left /  \ up
      //  down \  / right

      //when index 0 = moves normal
      //when index 1 (camera right 1) = up > right, right > down, down > left, left > up
      //when index 2 (camera right 2) = up > down, right > left, down > up, left > right
      //when index 3 (camera right 3) = up > left, right > up, down > right, left, down

      let newMove = move;
      console.log(cameraIndex);
      switch (cameraIndex) {
        case 1:
        case 2:
          switch (move) {
            case "up":
              newMove = "left";
              break;
            case "right":
              newMove = "up";
              break;
            case "down":
              newMove = "right";
              break;
            case "left":
              newMove = "down";
              break;
          }
          break;

        case 3:
        case 4:
          switch (move) {
            case "up":
              newMove = "down";
              break;
            case "right":
              newMove = "left";
              break;
            case "down":
              newMove = "up";
              break;
            case "left":
              newMove = "right";
              break;
          }
          break;

        case 5:
        case 6:
          switch (move) {
            case "up":
              newMove = "right";
              break;
            case "right":
              newMove = "down";
              break;
            case "down":
              newMove = "left";
              break;
            case "left":
              newMove = "up";
              break;
          }
          break;

        default:
          break;
      }
      return newMove;
    }; // end changeMoveFromCameraIndex

    const cameraIndex = cameraIndexRef.current;
    const lastPosition = [
      setFurnitureHelperRef.current.position.x,
      setFurnitureHelperRef.current.position.z,
      setFurnitureHelperRef.current.rotation.y,
    ];
    const placingFurnitureSize = setFurnitureHelperRef.current.children[0].name;
    let invalidMove = false;

    if (cameraIndex > 0) move = changeMoveFromCameraIndex(cameraIndex, move);

    // const directions = [north, west, south, east];
    // const south = -Math.PI / 1; //-3.14... down
    // const west = Math.PI / 2; //1.57... left
    // const north = 0; // up
    // const east = -Math.PI / 2; //-1.57... right

    switch (move) {
      case "left":
        if (lastPosition[0] - 1 == -4) {
          console.log("1 1");
          invalidMove = true;
        }
        if (
          placingFurnitureSize == "2x1" &&
          lastPosition[0] == -2 &&
          lastPosition[2] == directions[0]
        ) {
          console.log("1 2");
          invalidMove = true;
        }
        if (
          placingFurnitureSize == "2x2" &&
          ((lastPosition[0] == -2 && lastPosition[2] == directions[3]) ||
            (lastPosition[0] == -2 && lastPosition[2] == directions[0]))
        ) {
          console.log("1 3");
          invalidMove = true;
        }
        break;
      case "right":
        if (lastPosition[0] + 1 == 5) invalidMove = true;
        if (
          placingFurnitureSize == "2x1" &&
          lastPosition[0] == 3 &&
          lastPosition[2] == directions[2]
        )
          invalidMove = true;
        if (
          placingFurnitureSize == "2x2" &&
          ((lastPosition[0] == 3 && lastPosition[2] == directions[1]) ||
            (lastPosition[0] == 3 && lastPosition[2] == directions[2]))
        )
          invalidMove = true;
        break;
      case "up":
        if (lastPosition[1] - 1 == -4) invalidMove = true;
        if (
          placingFurnitureSize == "2x1" &&
          lastPosition[1] == -2 &&
          lastPosition[2] == directions[3]
        )
          invalidMove = true;
        if (
          placingFurnitureSize == "2x2" &&
          ((lastPosition[1] == -2 && lastPosition[2] == directions[2]) ||
            (lastPosition[1] == -2 && lastPosition[2] == directions[3]))
        )
          invalidMove = true;
        break;
      case "down":
        if (lastPosition[1] + 1 == 5) invalidMove = true;
        if (
          placingFurnitureSize == "2x1" &&
          lastPosition[1] == 3 &&
          lastPosition[2] == directions[1]
        )
          invalidMove = true;
        if (
          placingFurnitureSize == "2x2" &&
          ((lastPosition[1] == 3 && lastPosition[2] == directions[0]) ||
            (lastPosition[1] == 3 && lastPosition[2] == directions[1]))
        )
          invalidMove = true;
        break;
    }

    if (invalidMove) return;

    switch (move) {
      case "left":
        setFurnitureHelperRef.current.position.x -= 0.5;
        break;
      case "right":
        setFurnitureHelperRef.current.position.x += 0.5;
        break;
      case "up":
        setFurnitureHelperRef.current.position.z -= 0.5;
        break;
      case "down":
        setFurnitureHelperRef.current.position.z += 0.5;
        break;
    }

    changeHeightOfHelper();

    console.log(
      setFurnitureHelperRef.current.position.x,
      setFurnitureHelperRef.current.position.z
    );
  };

  const changeHeightOfHelper = () => {
    roomDataFurniture.forEach((furElement) => {
      setFurnitureHelperRef.current.position.y = 0;
      var furElementSpaces = null;
      if (furElement.size == "1x1") {
        furElementSpaces = [
          furElement.position[0],
          furElement.position[1],
          furElement.position[2],
        ];
      } else {
        furElementSpaces = checkSpaces2x2or2x1Item(furElement, furElement.size);
      }

      const helperPos = [
        setFurnitureHelperRef.current.position.x,
        setFurnitureHelperRef.current.position.y,
        setFurnitureHelperRef.current.position.z,
      ];

      console.log("furElementSpaces");
      console.log(furElementSpaces);
      console.log("helperPos.toString()");
      console.log(helperPos.toString());

      if (
        furElement.furProps.includes("lowerSurface") ||
        furElement.furProps.includes("surface")
      ) {
        if (furElement.size == "1x1") {
          if (helperPos.toString() == furElementSpaces.toString()) {
            if (furElement.furProps.includes("surface")) {
              setFurnitureHelperRef.current.position.y = 1.05;
              return;
            } else {
              setFurnitureHelperRef.current.position.y = 0.55;
              return;
            }
          }
        }
        for (let i = 0; i < furElementSpaces.length; i++) {
          if (helperPos.toString() == furElementSpaces[i].toString()) {
            if (furElement.furProps.includes("surface")) {
              console.log("entra y se la pela");
              setFurnitureHelperRef.current.position.y = 1.05;
              return;
            } else {
              console.log("entra y se la pela");
              setFurnitureHelperRef.current.position.y = 0.55;
              return;
            }
          }
        }
      }
    });
  };

  const CameraRig = ({ positionData: [x, y, z], lookAtData: [x2, y2, z2] }) => {
    const camera = useThree();
    camera.camera.zoom = zoomLevelRef.current || 100; //prevents zoom from reseting every render
    useFrame((state) => {
      state.camera.position.lerp({ x, y, z }, 0.05);
      state.camera.lookAt(x2, y2, z2);
      state.camera.updateProjectionMatrix();
    });
  };

  // TODO: change the event in the wheel to buttons. Ex: when changing walls, if you scroll
  // in the menu the zoom will activate
  const CameraZoomHandler = () => {
    const state = useThree();
    document.addEventListener("wheel", (event) => {
      console.log(changeWallsFloorMenuOpen);
      // prevent zoom when menus are open
      const changeWallsFloorMenuIsOpen = document.querySelectorAll(
        ".changeWallsFloorMenu__MainContainer"
      ).length;
      const furSelectorMenuOpen = document.querySelectorAll(
        ".furSelectorWrapper"
      ).length;
      const saveRoomWindowOpen = document.querySelectorAll(
        ".saveRoomMainContainer"
      ).length;
      const confirmationMenuOpen = document.querySelectorAll(
        ".confirmationMenuMainContainer"
      ).length;
      if (
        changeWallsFloorMenuIsOpen ||
        furSelectorMenuOpen ||
        saveRoomWindowOpen ||
        confirmationMenuOpen
      )
        return;
      const delta = Math.sign(event.deltaY);
      if (delta < 0) {
        if (state.camera.zoom > 120) return;
        state.camera.zoom = state.camera.zoom + 0.5;
      } else {
        if (state.camera.zoom < 80) return;
        state.camera.zoom = state.camera.zoom - 0.5;
      }
      zoomLevelRef.current = state.camera.zoom; // persist current zoom level
    });
  };

  const handleFurnitureClick = (e, key, name, furProps, colors) => {
    e.stopPropagation();
    if (placingFurniture) return;
    setFurMenuOpen({
      x: e.pageX,
      y: e.pageY,
      key: key,
      furName: name.replace(/([A-Z])/g, " $1").trim(),
      furProps: furProps,
      colors: colors,
    });
  };

  const RoomSpotLight = () => {
    const spotLight = useRef();

    useEffect(() => {
      spotLight.current
        ? spotLight.current.target.position.set(0.5, 0, 0.5)
        : null;
    }, [spotLight.current]);

    useHelper(spotLight, THREE.SpotLightHelper, "cyan");

    return (
      <>
        {/* <SpotLight
          visible={true}
          angle={15}
          intensity={10}
          position={[0.5, 8, 0.5]}
          color={"#ffd285"}
          distance={10}
          attenuation={5}
          anglePower={20}
          shadow-mapSize-height={2048}
          shadow-mapSize-width={2048}
          shadow-radius={10}
          shadow-bias={-0.003}
          castShadow
          ref={spotLight}
        /> */}
        <directionalLight
          castShadow
          intensity={1}
          position={[0, 5, 0]}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.00001}
          color={"#FFE6D1"}
        >
          <orthographicCamera
            attach="shadow-camera"
            // args={[-150.5, 150.5, 150.5, -150.5]}
            args={[-20, 20, 20, -20]}
          />
        </directionalLight>
        <ambientLight intensity={0.7} color={"#FFE6D1"} />
      </>
    );
  };

  const generateFurMenu = () => {
    return (
      <FurMenu
        furName={furMenuOpen.furName}
        x={furMenuOpen.x}
        y={furMenuOpen.y}
        refKey={furMenuOpen.key}
        furProps={furMenuOpen.furProps}
        colors={furMenuOpen.colors}
        selectedColor={
          roomDataFurniture.find((elem) => elem.key == furMenuOpen.key).color
        }
        removeFur={removeFur}
        toggleLightFur={toggleLightFur}
        changeColor={changeColor}
        setFurMenuOpen={setFurMenuOpen}
      />
    );
  };

  const changeColor = (key, color) => {
    let toggleColorFur = roomDataFurniture.find((elem) => elem.key == key);
    if (toggleColorFur.color != color) toggleColorFur.color = color;
    setFurMenuOpen(false);
  };

  const removeFur = (key) => {
    let elemToRemove = roomDataFurniture.find((element) => element.key == key);

    let furnitureToRemoveHeight = 1.05;
    if (elemToRemove.furProps.includes("lowerSurface"))
      furnitureToRemoveHeight = 0.55;

    let elemToRemoveSpaces = [];
    let keysToRemove = [];
    keysToRemove.push(elemToRemove.key);
    if (elemToRemove.size != "1x1") {
      elemToRemoveSpaces = checkSpaces2x2or2x1Item(
        elemToRemove,
        elemToRemove.size
      );
      for (let spaces of elemToRemoveSpaces) {
        elemToRemove = roomDataFurniture.find(
          (element) =>
            element.position.toString() ==
            [spaces[0], furnitureToRemoveHeight, spaces[2]].toString()
        );
        if (elemToRemove) keysToRemove.push(elemToRemove.key);
      }
    } else {
      elemToRemove = roomDataFurniture.find(
        (element) =>
          element.position.toString() ==
          [
            elemToRemove.position[0],
            furnitureToRemoveHeight,
            elemToRemove.position[2],
          ].toString()
      );
      if (elemToRemove) keysToRemove.push(elemToRemove.key);
    }
    setRoomDataFurniture(
      roomDataFurniture.filter((elem) => !keysToRemove.includes(elem.key))
    );

    setFurnitureHelperRef.current.position.y = 0;
    setFurMenuOpen(false);
  };

  const toggleLightFur = (key) => {
    let toggleFurData = roomDataFurniture.find((elem) => elem.key == key);
    toggleFurData.options.lightOn = !toggleFurData.options.lightOn;
    setFurMenuOpen(false);
  };

  const generateSelectingFurniture = () => {
    return (
      <FurSelector
        handleAddFurnitureClick={handleAddFurnitureClick}
        handleItemClick={handleItemClick}
      />
    );
  };

  const handleItemClick = (furId) => {
    setSelectingFurniture(false);
    const furSelected = furnitureData.find((element) => element.id == furId);
    setPlacingFurniture(true);
    setPlacingFurnitureData({
      size: furSelected.size,
      component: componentsMap[furSelected.name],
      name: furSelected.name,
      furProps: furSelected.furProps,
      colors: furSelected.colors,
    });
  };

  const handleAddFurnitureClick = (e) => {
    if (selectingFurniture) {
      //plays an animation when clicking cancel
      document
        .getElementsByClassName("furSelectorWrapper")[0]
        .animate([{ bottom: "0" }, { bottom: "-100%" }], {
          duration: 500,
          easing: "linear",
        });
      setTimeout(() => {
        setSelectingFurniture(false);
      }, 400);
    } else if (placingFurniture) {
      setSelectingFurniture(false);
      setPlacingFurniture(false);
    } else {
      setFurMenuOpen(false);
      setSelectingFurniture(true);
    }
  };

  const generateSaveRoomMenu = () => {
    return (
      <SaveRoomMenu
        closeSaveRoomMenu={(e) => setSaveRoomMenuOpen(!saveRoomMenuOpen)}
        roomDataFurniture={{
          furniture: roomDataFurniture,
          walls: roomDataWalls,
          floor: roomDataFloor,
        }}
      />
    );
  };

  const generateChangeWallsFloorMenu = () => {
    return (
      <ChangeWallsFloorMenu
        closeSaveRoomMenu={(e) =>
          setChangeWallsFloorMenuOpen(!changeWallsFloorMenuOpen)
        }
        roomDataWalls={roomDataWalls}
        setRoomDataWalls={setRoomDataWalls}
        roomDataFloor={roomDataFloor}
        setRoomDataFloor={setRoomDataFloor}
        buttonsContainerRef={buttonsContainerRef}
        rotateCameraLeftRef={rotateCameraLeftRef}
        rotateCameraRightRef={rotateCameraRightRef}
      />
    );
  };

  return (
    <>
      <Options
        setSelectingFurniture={setSelectingFurniture}
        setChangeWallsFloorMenuOpen={setChangeWallsFloorMenuOpen}
        changeWallsFloorMenuOpen={changeWallsFloorMenuOpen}
        setSaveRoomMenuOpen={setSaveRoomMenuOpen}
        saveRoomMenuOpen={saveRoomMenuOpen}
        componentsMap={componentsMap}
        FURNITURE={FURNITURE}
        setRoomDataFurniture={setRoomDataFurniture}
        setRoomDataFloor={setRoomDataFloor}
        setRoomDataWalls={setRoomDataWalls}
        setFreeCamera={setFreeCamera}
        freeCamera={freeCamera}
      />
      <div className="buttonsContainer" ref={buttonsContainerRef}>
        <button
          className="button"
          onClick={(e) => {
            handleAddFurnitureClick(e), playButtonHoverSound();
          }}
        >
          {selectingFurniture || placingFurniture ? "Cancel" : "Add furniture"}
        </button>
        <button
          id="rotateCameraLeft"
          ref={rotateCameraLeftRef}
          className="button"
          onClick={(e) => {
            changeCameraPosition("left", e), playButtonHoverSound();
          }}
        >
          Camera left
        </button>
        <button
          id="rotateCameraRight"
          ref={rotateCameraRightRef}
          className="button"
          onClick={(e) => {
            changeCameraPosition("right", e), playButtonHoverSound();
          }}
        >
          Camera right
        </button>

        {placingFurniture ? (
          <div className="movesContainer">
            <button
              className="button"
              id="moveFurLeft"
              onClick={(e) => {
                furnitureHelperMoveButtonHandler("left", e),
                  playButtonHoverSound();
              }}
            >
              ᐊ
            </button>
            <button
              className="button"
              id="moveFurRight"
              onClick={(e) => {
                furnitureHelperMoveButtonHandler("right", e),
                  playButtonHoverSound();
              }}
            >
              ᐅ
            </button>
            <button
              className="button"
              id="moveFurUp"
              onClick={(e) => {
                furnitureHelperMoveButtonHandler("up", e),
                  playButtonHoverSound();
              }}
            >
              ᐃ
            </button>
            <button
              className="button"
              id="moveFurDown"
              onClick={(e) => {
                furnitureHelperMoveButtonHandler("down", e),
                  playButtonHoverSound();
              }}
            >
              ᐁ
            </button>
            <button
              id="rotateFur"
              className="button"
              onClick={(e) => {
                rotateFurnitureButtonHandler(e), playButtonHoverSound();
              }}
            >
              Rotate
            </button>
            <button
              id="placeFur"
              className="button blue"
              onClick={(e) => {
                addFurnitureButtonHandler(), playButtonHoverSound();
              }}
            >
              Set
            </button>
          </div>
        ) : null}
      </div>

      {furMenuOpen ? generateFurMenu() : null}

      {selectingFurniture ? generateSelectingFurniture() : null}

      {saveRoomMenuOpen ? generateSaveRoomMenu() : null}

      {changeWallsFloorMenuOpen ? generateChangeWallsFloorMenu() : null}

      <Canvas
        gl={{ antialias: false, logarithmicDepthBuffer: true }}
        shadows
        orthographic
        camera={{
          zoom: 100,
          near: 1,
          far: 2000,
          attach: "shadow-camera",
        }}
        style={{ background: "#0a0a0a" }}
        dpr={[1, 2]}
      >
        <CameraZoomHandler />

        {/* Can be used to lower all the elements in screen so in the future, the room with walls fit better in the screen */}
        <group position={[0, -1.2, 0]}>
          {
            // DEBUG CAMERA
            !freeCamera ? (
              <CameraRig
                positionData={cameraPositions[cameraIndex]}
                lookAtData={lookAtCameraPositions[cameraIndex]}
              />
            ) : (
              <OrbitControls
                target={[0, 0, 0]}
                maxDistance={5000}
                minDistance={50}
              />
            )
          }

          <group>
            {roomDataFurniture.map((furniture) => (
              <furniture.model
                onPointerOver={() =>
                  console.log("TODO: Change cursor to some pointer")
                } //TODO: Change cursor to some pointer
                key={furniture.key}
                position={furniture.position}
                rotation={furniture.rotation}
                options={furniture.options}
                color={furniture.color || null}
                onPointerDown={(e) =>
                  handleFurnitureClick(
                    e,
                    furniture.key,
                    furniture.model.name,
                    furniture.furProps,
                    furniture.options.colors
                  )
                }
              />
            ))}
          </group>

          {/* {debugHelperColisions ?
            <group>
              {debugHelperColisions.map((coords, key) =>
                <mesh position={coords} key={key}>
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color={'orange'} opacity={0.2} transparent />
                  <Edges color={'white'} />
                </mesh>
              )}
            </group>
          : null} */}

          <SetFurnitureHelper
            ref={setFurnitureHelperRef}
            isPlacing={placingFurniture ? true : false}
          />

          <RoomSpotLight />

          <Floor floorId={roomDataFloor} />
          <Walls wallIds={roomDataWalls} />
        </group>
        {/* <gridHelper position={[0.5,0,0.5]} args={[8, 8, "red", "blue"]} /> */}
      </Canvas>
    </>
  );
}

export default App;
