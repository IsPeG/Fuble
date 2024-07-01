import React, { useState, useRef } from "react";
import IconItemElement from "../IconItemElement/IconItemElement";
import StylizedSelect from "../StylizedInputs/Select/StylizedSelect";
import StylizedTextInput from "../StylizedInputs/Text/StylizedTextInput";

import furnitureData from "../../../_furnitureData/data.json";

import "./furSelector.css";
import useDebounce from "../../../customHooks/useDebounce";

export default function FurSelector(props) {
  const [seriesFilter, setSeriesFilter] = useState(null);
  const [nameFilter, setNameFilter] = useState("");
  const debNameFilter = useDebounce(nameFilter, 500);
  const furData = [...furnitureData];

  const Filters = () => {
    return (
      <div className="filtersContainer">
        <StylizedTextInput
          handleChange={setNameFilter}
          nameFilter={nameFilter}
        />
        <StylizedSelect
          handleChange={setSeriesFilter}
          seriesFilter={seriesFilter}
        />
      </div>
    );
  };

  const gerenateFilteredFurIcons = () => {
    let furDataFiltered = furData;
    if (debNameFilter) {
      furDataFiltered = furDataFiltered.filter((elem) =>
        elem.name
          .toLocaleLowerCase()
          .includes(debNameFilter.toLocaleLowerCase())
      );
    }
    if (seriesFilter) {
      furDataFiltered = furDataFiltered.filter(
        (elem) => elem.series == seriesFilter
      );
    }
    return furDataFiltered.map((furniture, key) => (
      <IconItemElement
        key={key}
        backgroundImage={furniture.name}
        furnitureId={furniture.id}
        elementType={"furniture"}
        elementName={furniture.name}
        onClick={(e) => props.handleItemClick(furniture.id)}
      />
    ));
  };

  console.log(nameFilter);

  return (
    <>
      <div
        className="furSelectorBackground"
        onPointerDown={(e) => props.handleAddFurnitureClick()}
      >
        <div
          className="furSelectorWrapper"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Filters />
          <div className="furSelector">
            {seriesFilter || debNameFilter != ""
              ? gerenateFilteredFurIcons()
              : furData.map((furniture, key) => (
                  <IconItemElement
                    key={key}
                    backgroundImage={furniture.name}
                    furnitureId={furniture.id}
                    elementType={"furniture"}
                    elementName={furniture.name}
                    onClick={(e) => props.handleItemClick(furniture.id)}
                  />
                ))}
          </div>
        </div>
      </div>
    </>
  );
}
