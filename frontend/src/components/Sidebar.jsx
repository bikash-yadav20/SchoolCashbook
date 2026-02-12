import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isActive, setIsActive }) => {
  return (
    <div
      className={`fixed top-15 left-0 h-screen w-64 transition-all ${isActive ? " bg-blue-500 text-white p-5" : "hidden"}`}
    >
      <h2 className="flex justify-between  text-xl mb-6">
        {" "}
        KAIZEN ACADEMY{" "}
        <span
          className="text-white font-bold cursor-pointer hover:text-red-800"
          onClick={() => setIsActive(false)}
        >
          {" "}
          X{" "}
        </span>{" "}
      </h2>

      <ul className="space-y-2">
        <li>
          <Link
            to="/priorities"
            className="block w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Priorities
          </Link>
        </li>
        <li>
          <Link
            to="/fees"
            className="block w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Add Fees
          </Link>
        </li>
        <li>
          <Link
            to="/expense"
            className="block w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Add Expense
          </Link>
        </li>
        <li>
          <Link
            to="/ledger"
            className="block w-full bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Open & CLose balance
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
