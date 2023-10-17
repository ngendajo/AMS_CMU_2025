import { useState } from "react";
import { useAsyncDebounce } from "react-table";
import {FaSearch} from "react-icons/fa";

export const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);
console.log(globalFilter)
  return (
    <div className='input-wrapper search-staff'>
                <FaSearch id='search-icon'/>
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search records...`}
        style={{
          fontSize: "0.9rem",
          margin: "0.1rem 0",
        }}
      />
    </div>
  );
};