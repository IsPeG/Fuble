import React from "react";

import "./confirmationMenu.css";

export default function ConfirmationMenu(props) {
  return (
    <div
      className="confirmationMenuBackground"
      onPointerDown={(e) => props.actionNo(false)}
    >
      <div
        className="confirmationMenuMainContainer"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <h1>Confirm action</h1>
        <p>{props.actionDescription}</p>

        <div className="confirmationMenuButtonsContainer">
          <button onClick={(e) => props.actionYes()} className="button blue">
            Yes
          </button>
          <button onClick={(e) => props.actionNo(false)} className="button red">
            No
          </button>
        </div>
      </div>
    </div>
  );
}
