// DynamicTable.js
import React, { useState, useEffect } from 'react';
import './DynamicTable.css';
import {FaSearch} from "react-icons/fa"

const DynamicTable = ({ mockdata }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(itemsPerPage);
  

  useEffect(() => {
    setFilteredData(mockdata);
  }, [mockdata]);
  

  const handleSort = (key) => {
    const sortedData = [...filteredData].sort((a, b) => (a[key] > b[key] ? 1 : -1));
    setFilteredData(sortedData);
  };

  const handleFilter = (searchTerm) => {
    const filteredData = mockdata.filter((item) =>
      Object.values(item).some((value) =>
        value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setSelectedItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const renderTableHeaders = () => {
    const firstDataObject = filteredData.length > 0 ? filteredData[0] : {};
    const headerKeys = Object.keys(firstDataObject);

    return headerKeys.map((header) => (
      <th key={header} onClick={() => handleSort(header)}>
        {header}
      </th>
    ));
  };

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    return currentData.map((item, index) => (
      <tr key={index}>
        {Object.keys(item).map((header) => (
          <td key={header}>{item[header]}</td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="table-container">
      <div className='input-wrapper filter-container'>
        <FaSearch id='search-icon'/>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => handleFilter(e.target.value)}
        />
      </div>
      <div className="custom-select-container">
        <label>
          Items Per Page:
        </label>
        <select 
          className="custom-select"
          value={selectedItemsPerPage} 
          onChange={handleItemsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
      </div>
      
      <table className="responsive-table">
        <thead>
          <tr>{renderTableHeaders()}</tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <div>
      <button
        className='prenext'
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className='pageno'>pag. {currentPage} of {Math.ceil((filteredData.length/itemsPerPage))}</span>
        <button
          className='prenext'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={filteredData.length === 0 || currentPage=== Math.ceil((filteredData.length/itemsPerPage))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DynamicTable;
