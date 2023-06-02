import React, { useState } from "react";
import ConfirmationMenu from "../ConfirmationMenu/ConfirmationMenu";

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
    props.setSaveRoomMenuOpen(!props.saveRoomMenuOpen);
    setOptionsOpen(false);
  };

  const changeWallsFloorButtonHandler = () => {
    props.setChangeWallsFloorMenuOpen(!props.changeWallsFloorMenuOpen);
    setOptionsOpen(false);
  };

  const handleDeleteRoomButton = () => {
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
              onClick={(e) => handleDeleteRoomButton()}
            >
              Clean room
            </button>
            <button
              className="button"
              onClick={(e) => changeWallsFloorButtonHandler()}
            >
              Change walls & floor
            </button>
            <button className="button" onClick={(e) => saveRoomButtonHandler()}>
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
              onClick={(e) => setOptionsOpen(false)}
            >
              Cancel Options
            </button>
          </>
        ) : (
          <button
            className="button yellow"
            onClick={(e) => setOptionsOpen(true)}
          >
            Options
          </button>
        )}
      </div>
    </>
  );
}
