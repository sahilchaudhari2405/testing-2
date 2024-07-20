import React from 'react';

const Dropdown = ({ options, selectedCounter, onSelectCounter }) => {
  return (
    <select 
      value={selectedCounter}
      onChange={(e) => onSelectCounter(e.target.value)}
      className="p-2 rounded-md bg-gray-200 border border-gray-300"
    >
      {options.map((counter, index) => (
        <option key={index} value={index}>{counter.title}</option>
      ))}
    </select>
  );
}

export default Dropdown;
