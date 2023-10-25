import React from "react";

import "./stylizedTextInput.css";

export default function StylizedTextInput(props) {
  return (
    <div>
      <input
        autoFocus
        type="text"
        value={props.nameFilter}
        className="stylizedTextInput"
        onChange={(e) => props.handleChange(e.target.value)}
      />
    </div>
  );
}
