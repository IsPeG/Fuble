import React, { useEffect } from "react";

import "./furMenu.css";
import colors from "../../../_colorsData/colors";

export default function FurMenu(props) {
  return (
    <div
      className="furMenuBackdrop"
      onPointerDown={(e) => props.setFurMenuOpen(false)}
    >
      <div
        className="furMenu"
        style={{
          transform: `translate(${props.x}px, calc(${props.y}px - 110%))`,
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span>{props.furName}</span>
        <ol>
          <li className="hoverEff">Information</li>
          {props.furProps.map((elem, key) => {
            switch (elem) {
              case "light":
                return (
                  <li
                    className="hoverEff"
                    onPointerDown={() => props.toggleLightFur(props.refKey)}
                    key={key}
                  >
                    Toggle light
                  </li>
                );
                break;
              case "colors":
                return (
                  <li>
                    Change style
                    <ul className="colorsList">
                      {props.colors.map((elem, index) => {
                        let classes =
                          elem === props.selectedColor
                            ? "colorIcon checkedColorIcon"
                            : "colorIcon";
                        return (
                          <div
                            key={index}
                            className={classes}
                            style={{
                              backgroundColor: colors.find(
                                (item) => item.color == elem
                              ).value,
                            }}
                            onPointerDown={() =>
                              props.changeColor(props.refKey, elem)
                            }
                          ></div>
                        );
                      })}
                    </ul>
                  </li>
                );
                break;
              default:
                break;
            }
          })}
          <li
            className="hoverEff"
            onPointerDown={() => props.removeFur(props.refKey)}
          >
            Remove
          </li>
        </ol>
      </div>
    </div>
  );
}
