import React from "react";
import FurSelectorItem from "../FurSelectorItem/FurSelectorItem";

import furnitureData from "../../../furnitureData/data.json";

import "./furSelector.css";

export default function FurSelector(props) {
  const furData = [...furnitureData];

  const Filters = () => {
    return (
      <div className="filtersContainer">
        <div className="furSelectorItem">
          <img
            className="furSelectorItemImage"
            src={`/src/assets/textures/ui/icons/filter1.png`}
            alt="icon"
          />
        </div>
        <div className="furSelectorItem">
          <img
            className="furSelectorItemImage"
            src={`/src/assets/textures/ui/icons/filter2.png`}
            alt="icon"
          />
        </div>
        <div className="furSelectorItem">
          <img
            className="furSelectorItemImage"
            src={`/src/assets/textures/ui/icons/filter3.png`}
            alt="icon"
          />
        </div>
        <div className="furSelectorItem">
          <img
            className="furSelectorItemImage"
            src={`/src/assets/textures/ui/icons/filter4.png`}
            alt="icon"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="furSelectorWrapper">
        <Filters />
        <div className="furSelector">
          {furData.map((furniture, key) => (
            <FurSelectorItem
              key={key}
              furId={furniture.id}
              furName={furniture.name}
              furSize={furniture.size}
              handleItemClick={props.handleItemClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}
