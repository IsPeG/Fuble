import React, { useEffect } from "react";

import "./furMenu.css";

export default function FurMenu(props) {
  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <div
      className="furMenu"
      style={{ transform: `translate(${props.x}px, ${props.y}px)` }}
    >
      <span>{props.furName}</span>
      <ol>
        {props.furProps.map((elem, key) => {
          switch (elem) {
            case "light":
              return (
                <li
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
                  <ul>
                    {props.colors.map((elem, index) => (
                      <li
                        key={index}
                        onPointerDown={() =>
                          props.changeColor(props.refKey, elem)
                        }
                      >
                        {elem}
                      </li>
                    ))}
                  </ul>
                </li>
              );
              break;
            default:
              break;
          }
        })}
        <li onPointerDown={() => props.removeFur(props.refKey)}>Remove</li>
      </ol>
    </div>
  );
}
