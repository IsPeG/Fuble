import React, { useEffect, useState } from "react";

import "./changeWallsFloorMenu.css";
import "react-tooltip/dist/react-tooltip.css";

import wallsData from "../../../_wallsData/data.json";
import floorsData from "../../../_floorsData/data.json";

export default function ChangeWallsFloorMenu(props) {
  const [selectingElement, setSelectingElement] = useState("");
  const [selectingElementIndex, setSelectingElementIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    props.buttonsContainerRef.current.style.display = "none";
    return () => {
      props.buttonsContainerRef.current.style.display = "block";
    };
  }, []);

  const ElementSelector = (props) => {
    const [selected, setSelected] = useState({ marginLeft: "1rem" });
    useEffect(() => {
      if (
        props.indexMainContainer != undefined &&
        props.indexMainContainer == props.selectedIndex
      ) {
        setSelected({ marginLeft: "1rem", fontWeight: "bold" });
      }
    }, []);

    const replaceImage = (e) => {
      e.currentTarget.src =
        "/src/assets/textures/ui/icons/furniture/missingFurIcon.png";
    };

    return (
      <div style={{ display: "flex" }} onClick={props.onClick}>
        <div className={"changeWallsFloorMenuButton"}>
          <img
            className={"changeWallsFloorMenuButtonImage"}
            src={`/src/assets/textures/ui/icons/${props.elementType}/${props.backgroundImage}.png`}
            alt="icon"
            onError={(e) => replaceImage(e)}
          />
        </div>
        <p style={selected}>{props.elementName}</p>
      </div>
    );
  };

  const ElementsList = (props) => {
    const [elementsData, setElementsData] = useState(null);

    useEffect(() => {
      setElementsData(selectingElement == "Walls" ? wallsData : floorsData);
    }, []);

    return (
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="changeWallsFloorMenuMainContainer"
      >
        <h1>{selectingElement}</h1>
        <div className="changeWallsFloorMenuElementsListGrid">
          {elementsData
            ? elementsData.map((elem, index) => (
                <ElementSelector
                  backgroundImage={elem.name}
                  elementType={selectingElement.toLowerCase()}
                  elementName={formatNameFromString(elem.name)}
                  onClick={(e) =>
                    selectElementHandleClick(
                      elem.id,
                      selectingElement.toLowerCase()
                    )
                  }
                />
              ))
            : null}
        </div>
      </div>
    );
  };

  const elementSelectorHandleClick = (index, type, slectedIndex) => {
    setSelectingElementIndex(index);
    setSelectingElement(type);
    setSelectedIndex(slectedIndex);
  };

  const selectElementHandleClick = (index, type) => {
    if (type == "floors") {
      props.setRoomDataFloor(index);
    } else {
      let wallsArrayCopy = props.roomDataWalls;
      wallsArrayCopy[selectingElementIndex] = index;
      props.setRoomDataWalls([...wallsArrayCopy]);
    }
  };

  // formats the name of the wall/floor to a one more readable
  const formatName = (index, type) => {
    let data = type == "wall" ? wallsData : floorsData;
    if (type == "wall") {
      return formatNameFromString(
        data.find((elem) => elem.id == props.roomDataWalls[index]).name
      );
    } else {
      return formatNameFromString(
        data.find((elem) => elem.id == props.roomDataFloor).name
      );
    }
  };

  const formatNameFromString = (name) => {
    const content = name
      .replace(/([-_][a-z])/g, (k) => k[1].toUpperCase())
      .replace(/([A-Z])/g, " $1")
      .trim();
    return content[0].toUpperCase() + content.slice(1);
  };

  return (
    <div
      className="changeWallsFloorMenuBackground"
      style={{ flexDirection: selectingElement ? "row" : "row-reverse" }}
      onPointerDown={props.closeSaveRoomMenu}
    >
      {selectingElement ? <ElementsList /> : null}

      <div>
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginBottom: "2rem",
          }}
        >
          <button
            className="button blue"
            onClick={(e) => props.rotateCameraLeftRef.current.click()}
          >
            Rotate camera left
          </button>
          <button
            onClick={(e) => props.rotateCameraRightRef.current.click()}
            className="button blue"
          >
            Rotate camera right
          </button>
        </div>
        <div
          className="changeWallsFloorMenuMainContainer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <h1>Change Walls & Floor</h1>
          <h2>Walls</h2>
          <div className="changeWallsFloorMenuWallsContainer">
            <ElementSelector
              indexMainContainer={0}
              selectedIndex={selectedIndex}
              backgroundImage={
                wallsData.find((elem) => elem.id == props.roomDataWalls[0]).name
              }
              elementType={"walls"}
              elementName={formatName(0, "wall")}
              onClick={(e) => elementSelectorHandleClick(0, "Walls", 0)}
            />
            <ElementSelector
              indexMainContainer={1}
              selectedIndex={selectedIndex}
              backgroundImage={
                wallsData.find((elem) => elem.id == props.roomDataWalls[1]).name
              }
              elementType={"walls"}
              elementName={formatName(1, "wall")}
              onClick={(e) => elementSelectorHandleClick(1, "Walls", 1)}
            />
            <ElementSelector
              indexMainContainer={2}
              selectedIndex={selectedIndex}
              backgroundImage={
                wallsData.find((elem) => elem.id == props.roomDataWalls[2]).name
              }
              elementType={"walls"}
              elementName={formatName(2, "wall")}
              onClick={(e) => elementSelectorHandleClick(2, "Walls", 2)}
            />
            <ElementSelector
              indexMainContainer={3}
              selectedIndex={selectedIndex}
              backgroundImage={
                wallsData.find((elem) => elem.id == props.roomDataWalls[3]).name
              }
              elementType={"walls"}
              elementName={formatName(3, "wall")}
              onClick={(e) => elementSelectorHandleClick(3, "Walls", 3)}
            />
          </div>
          <h2>Floor</h2>
          <div className="changeWallsFloorMenuFloorContainer">
            <div>
              <ElementSelector
                indexMainContainer={4}
                selectedIndex={selectedIndex}
                backgroundImage={
                  floorsData.find((elem) => elem.id == props.roomDataFloor).name
                }
                elementType={"floors"}
                elementName={formatName(0, "floor")}
                onClick={(e) => elementSelectorHandleClick(0, "Floors", 4)}
              />
            </div>
          </div>
        </div>

        {/* <div
          className="changeWallsFloorMenuSelectorContainer"
          style={{ display: "none" }}
          onPointerDown={(e) => e.stopPropagation()}
        ></div> */}
      </div>
    </div>
  );
}
