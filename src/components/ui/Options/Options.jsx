import React, { useState } from "react";

import "./options.css";

export default function Options(props) {
  const [optionsOpen, setOptionsOpen] = useState(false);

  const loadRoomButtonHandler = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      let data = JSON.parse(e.target.result);
      data.forEach((elem) => (elem.model = props.componentsMap[elem.name]));
      props.setRoomData(data);
    };
    setOptionsOpen(false);
  };

  const saveRoomButtonHandler = () => {
    props.setSaveRoomMenuOpen(!props.saveRoomMenuOpen);
    setOptionsOpen(false);
  };

  const deleteRoomData = () => {
    props.setRoomData([]);
    setOptionsOpen(false);
  };

  console.log("optionsOpen", optionsOpen);

  return (
    <div className="options-container">
      {optionsOpen ? (
        <>
          <button className="button red" onClick={(e) => deleteRoomData()}>
            Delete room
          </button>
          <button
            className="button yellow"
            onClick={(e) => saveRoomButtonHandler()}
          >
            Save Room
          </button>
          <label className="button yellow" htmlFor="loadRoom">
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
        <button className="button yellow" onClick={(e) => setOptionsOpen(true)}>
          Options
        </button>
      )}
    </div>
  );
}
