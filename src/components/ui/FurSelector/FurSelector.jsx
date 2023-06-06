import React, { useState } from "react";
import FurSelectorItem from "../FurSelectorItem/FurSelectorItem";

import furnitureData from "../../../_furnitureData/data.json";

import "./furSelector.css";

export default function FurSelector(props) {
  const [filter, setFilter] = useState(null);
  const furData = [...furnitureData];

  console.log(filter);

  const Filters = () => {
    const filtersTypes = ["sit", "table", "plant", "light", "misc"];

    const handleFilterClick = (filterName) => {
      setFilter(filter == filterName ? null : filterName);
    };

    return (
      <div className="filtersContainer">
        {filtersTypes.map((element, key) => (
          <div
            id={`${element}FilterButton`}
            className={
              filter == element ? "furSelectorItem selected" : "furSelectorItem"
            }
            onClick={(e) => handleFilterClick(element)}
          >
            <img
              className="furSelectorItemImage"
              src={`/src/assets/textures/ui/icons/filters/filter${key}.png`}
              alt="icon"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="furSelectorWrapper">
        <Filters />
        <div className="furSelector">
          {filter
            ? furData.map((furniture, key) =>
                filter == furniture.type ? (
                  <FurSelectorItem
                    key={key}
                    furId={furniture.id}
                    furName={furniture.name}
                    furSize={furniture.size}
                    handleItemClick={props.handleItemClick}
                  />
                ) : null
              )
            : furData.map((furniture, key) => (
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
