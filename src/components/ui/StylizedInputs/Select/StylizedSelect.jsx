import React, { useState, useLayoutEffect } from "react";
import Select from "react-select";
import seriesData from "../../../../_seriesData/data.json";

import "./stylizedSelect.css";

export default function StylizedSelect(props) {
  const [options, setOptions] = useState(null);

  useLayoutEffect(() => {
    let optionsData = seriesData.map((elem) => {
      return {
        value: elem.id,
        label: elem.name
          .replace(/([-_][a-z])/g, (k) => k[1].toUpperCase())
          .replace(/([A-Z])/g, " $1")
          .trim(),
        id: elem.id,
      };
    });
    setOptions(optionsData);
  }, []);

  const selectHandleChange = (value) => {
    props.handleChange(value?.value || 0);
  };

  return (
    <>
      {options ? (
        <Select
          isClearable
          isSearchable
          defaultValue={options.find((elem) => (elem.id = props.seriesFilter))}
          className="stylizedSelect"
          styles={{
            control: (styles) => ({ ...styles, borderRadius: "1rem" }),
          }}
          options={options}
          onChange={(value) => selectHandleChange(value)}
        />
      ) : null}
    </>
  );
}
