import React, { useRef } from "react";

import "./saveRoomMenu.css";

export default function SaveRoomMenu(props) {
  const inputRef = useRef(null);

  const saveRoom = () => {
    if (inputRef.current.value == "") return;

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(props.roomData)
    )}`;

    console.log(props.roomData);

    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `${inputRef.current.value}.json`;

    link.click();
    props.closeSaveRoomMenu();
  };

  return (
    <div className="saveRoomBackground" onPointerDown={props.closeSaveRoomMenu}>
      <div
        className="saveRoomMainContainer"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <h1>Save Room</h1>
        <input ref={inputRef} type="text" placeholder="Enter the room name" />
        <button className="button blue" onClick={saveRoom}>
          Save
        </button>
        <p>
          Note: This will download a json file in your machine. Later, you can
          load this file to get the room in the editor.
        </p>
      </div>
    </div>
  );
}
