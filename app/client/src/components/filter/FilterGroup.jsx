import { useRef, useState } from "react";
import "./Filter.css";
import FilterList from "./Filter";
import Filter from "./Filter";

function FilterGroup({ filters, onFiltersChanged }) {
  const handleFilterChanged = (filterKey, criterionKey, isChecked) => {
    onFiltersChanged(filterKey, criterionKey, isChecked);
  };

  return (
    <div className="filter-container">
      {Object.keys(filters).map((key) => {
        const filter = filters[key];
        return (
          <Filter
            criteria={filter.criteria}
            name={filter.name}
            key={key}
            onCriteriaChanged={(criterionKey, isChecked) =>
              handleFilterChanged(key, criterionKey, isChecked)
            }
          />
        );
      })}
    </div>
  );
}

export default FilterGroup;
