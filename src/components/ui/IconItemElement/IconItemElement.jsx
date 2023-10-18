import React from "react";
import "./IconItemElement.css";
import { Tooltip } from "react-tooltip";

export default function IconItemElement(props) {
  const replaceImage = (e) => {
    e.currentTarget.src =
      "/src/assets/textures/ui/icons/furniture/missingFurIcon.png";
  };

  return (
    <>
      <div
        data-tooltip-id={`tooltip-${props.furId}`}
        data-tooltip-content={props.elementName
          .replace(/([A-Z])/g, " $1")
          .trim()}
        data-tooltip-place="top"
        onMouseDown={props.onClick}
        className={
          props.elementType == "furniture"
            ? "IconItemElementFur"
            : "IconItemElementWF"
        }
        style={
          props.selected
            ? {
                background:
                  "repeating-linear-gradient(45deg,#FCFAE4,#FCFAE4 10px,#c9beb1 10px,#c9beb1 20px)",
              }
            : null
        }
      >
        <img
          className={
            props.elementType == "furniture"
              ? "IconItemElementImageFur"
              : "IconItemElementImageWF"
          }
          style={props.selected ? { borderColor: "#271C0E" } : null}
          src={`/src/assets/textures/ui/icons/${props.elementType}/${props.backgroundImage}.png`}
          alt="icon"
          onError={(e) => replaceImage(e)}
        />
        {props.elementType != "furniture" ? (
          <p
            style={
              props.selected
                ? {
                    fontWeight: "bold",
                    paddingTop: ".3rem",
                    paddingBottom: ".3rem",
                  }
                : null
            }
          >
            {props.elementName}
          </p>
        ) : null}
      </div>
      {props.elementType != "furniture" ? null : (
        <Tooltip id={`tooltip-${props.furId}`} />
      )}
    </>
  );
}
