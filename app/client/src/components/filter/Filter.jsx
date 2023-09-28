import { useEffect, useState } from "react";
import Checkbox from "../input/checkbox/Checkbox";
import Subtitle from "../text/Subtitle";
import "./Filter.css";

function Filter({ name, criteria, onCriteriaChanged }) {
  const handleCriterionChange = (key, isChecked) => {
    onCriteriaChanged(key, isChecked);
  };

  return (
    <div className="filter">
      <Subtitle value={name} />
      {Object.keys(criteria).map((key) => {
        const criterion = criteria[key];
        return (
          <Checkbox
            id={key}
            value={criterion.name}
            isChecked={criterion.isChecked}
            handleChange={(id, isChecked) =>
              handleCriterionChange(key, isChecked)
            }
          />
        );
      })}
    </div>
  );
}

export default Filter;
