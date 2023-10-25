import React, { useState } from "react";
import ConfirmationMenu from "../ConfirmationMenu/ConfirmationMenu";
import { playButtonHoverSound } from "../../../sounds";

import "./options.css";

export default function Options(props) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState("");

  const loadRoomButtonHandler = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      let data = JSON.parse(e.target.result);
      data.furniture.forEach(
        (elem) => (elem.model = props.componentsMap[elem.name])
      );
      props.setRoomDataFurniture(data.furniture);
      props.setRoomDataFloor(data.floor);
      props.setRoomDataWalls(data.walls);
    };
    setOptionsOpen(false);
  };

  const saveRoomButtonHandler = () => {
    props.setSelectingFurniture(false);
    props.setSaveRoomMenuOpen(!props.saveRoomMenuOpen);
    setOptionsOpen(false);
  };

  const changeWallsFloorButtonHandler = () => {
    props.setSelectingFurniture(false);
    props.setChangeWallsFloorMenuOpen(!props.changeWallsFloorMenuOpen);
    setOptionsOpen(false);
  };

  const handleDeleteRoomButton = () => {
    props.setSelectingFurniture(false);
    setConfirmationOpen("delete_room");
  };

  const generateConfirmationMenu = () => {
    switch (confirmationOpen) {
      case "delete_room":
        return (
          <ConfirmationMenu
            actionDescription={
              "Are you sure you want to remove all furniture from the room?"
            }
            actionYes={deleteRoomData}
            actionNo={setConfirmationOpen}
          />
        );
    }
  };

  const deleteRoomData = () => {
    props.setRoomDataFurniture([]);
    setOptionsOpen(false);
    setConfirmationOpen(false);
  };

  return (
    <>
      {confirmationOpen ? generateConfirmationMenu() : null}
      <div className="options-container">
        {optionsOpen ? (
          <>
            <button
              className="button red"
              onClick={(e) => {
                handleDeleteRoomButton(), playButtonHoverSound();
              }}
            >
              Clean room
            </button>
            <button
              className="button"
              onClick={(e) => {
                changeWallsFloorButtonHandler(), playButtonHoverSound();
              }}
            >
              Change walls & floor
            </button>
            <button
              className="button"
              onClick={(e) => {
                saveRoomButtonHandler(), playButtonHoverSound();
              }}
            >
              Save Room
            </button>
            <label className="button" htmlFor="loadRoom">
              Load Room
            </label>
            <input
              className="button"
              id="loadRoom"
              type="file"
              onChange={loadRoomButtonHandler}
            />
            <button
              className="button yellow"
              onClick={(e) => {
                setOptionsOpen(false), playButtonHoverSound();
              }}
            >
              Cancel Options
            </button>
          </>
        ) : (
          <button
            className="button yellow"
            onClick={(e) => {
              setOptionsOpen(true), playButtonHoverSound();
            }}
          >
            Options
          </button>
        )}
      </div>
    </>
  );
}
