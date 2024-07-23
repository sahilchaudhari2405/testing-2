import React from 'react';

const CategorySuggestions = ({ categories, onSelect, position }) => {
  return (
    <div
      className="absolute bg-white border border-gray-300 rounded shadow-md mt-1 z-10 w-fit py-10 px-3 max-h-60 overflow-y-scroll"
      style={{ top: '7vh', left: `30vw` }}
    >
      {categories.length === 0 ? (
        <div className="px-4 py-2">No results</div>
      ) : (
        categories.map((category) => (
          <div
            key={category._id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect(category.name)}
          >
            {category.name}
          </div>
        ))
      )}
    </div>
  );
};

export default CategorySuggestions;
