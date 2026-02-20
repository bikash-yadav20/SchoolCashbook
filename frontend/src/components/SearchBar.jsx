import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Search:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by reason..."
        className="border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600"
      />
    </div>
  );
}
