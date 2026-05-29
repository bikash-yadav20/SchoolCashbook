import React, { useEffect, useState } from "react";
import {
  leaveTypes as fetchLeaveTypes,
  getLeaveRules,
  createLeaveRules,
} from "../api/leaveRules";
import {
  createDeductionRule,
  deductionTypes as fetchDeductionTypes,
  getDeductionRules,
} from "../api/deductionRules";

const LeaveAndDeduction = () => {
  const [leaveRule, setLeaveRule] = useState(false);
  const [deductionRule, setDeductionRule] = useState(false);
  const [deductionRuleData, setDeductionRuleData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [deductionTypes, setDeductionTypes] = useState([]);
  const [leaveRulesData, setLeaveRulesData] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: "",
    maxDays: "",
    deduction: "",
    description: "",
  });
  const [deductionFormData, setDeductionFormData] = useState({
    deductionType: "",
    deductionPercent: "",
    description: "",
  });

  useEffect(() => {
    const loadLeaveTypes = async () => {
      try {
        const data = await fetchLeaveTypes();
        setLeaveTypes(data);
      } catch (error) {
        console.error("Error fetching leave enum", error);
      }
    };
    loadLeaveTypes();
  }, []);

  useEffect(() => {
    const loadDeductionTypes = async () => {
      try {
        const data = await fetchDeductionTypes();
        setDeductionTypes(data);
      } catch (error) {
        console.error("Error fetching deduction enum", error);
      }
    };
    loadDeductionTypes();
  }, []);

  const handleDeductionChange = (e) => {
    setDeductionFormData({
      ...deductionFormData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const loadDeductionRule = async () => {
      try {
        const res = await getDeductionRules();
        setDeductionRuleData(res.data);
        console.log(deductionRuleData);
      } catch (error) {
        console.error("error fetching deduction rule ", error);
      }
    };
    loadDeductionRule();
  }, []);

  const handleDeductionSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createDeductionRule(deductionFormData);
      console.log("submitting deduction rule", result);
      const res = await getDeductionRules();
      setDeductionRuleData(res.data);
      setDeductionRule(false);
      setDeductionFormData({});
    } catch (error) {
      console.error("Error fetching deduction rules", error);
    }
  };

  useEffect(() => {
    const loadLeaveRules = async () => {
      try {
        const res = await getLeaveRules();
        setLeaveRulesData(res.data);
      } catch (error) {
        console.error("Error fetching leave rulse", error);
      }
    };
    loadLeaveRules();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createLeaveRules(formData);
      console.log("Submitting leave rule:", result);
      const res = await getLeaveRules();
      setLeaveRulesData(res.data);
      setLeaveRule(false);
      setFormData({});
    } catch (err) {
      console.error("Error creating leave rule:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Leave & Deduction Management</h1>

      {/* Leave Rules Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Leave Rules</h2>
          <button
            onClick={() => setLeaveRule(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Leave Rule
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Rule ID</th>
              <th className="border px-4 py-2">Leave Type</th>
              <th className="border px-4 py-2">Max Days</th>
              <th className="border px-4 py-2">Deduction</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRulesData.map((rules) => (
              <tr key={rules.id}>
                <td className="border px-4 py-2">{rules.id}</td>
                <td className="border px-4 py-2">{rules.leaveType}</td>
                <td className="border px-4 py-2">{rules.maxDays}</td>
                <td className="border px-4 py-2">
                  {rules.deduction} day salary
                </td>
                <td className="border px-4 py-2">{rules.description}</td>
                <td className="border px-4 py-2 text-blue-600 cursor-pointer">
                  Edit | Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup to add leave rule */}
      {leaveRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Create a Leave Rule</h3>
            <form onSubmit={handleLeaveSubmit}>
              <label className="block mb-2">Leave Type</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="border rounded p-2 w-full mb-4"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Max Days</label>
              <input
                type="number"
                name="maxDays"
                value={formData.maxDays}
                onChange={handleChange}
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter max days"
              />

              <label className="block mb-2">Deduction %</label>
              <input
                type="number"
                name="deduction"
                value={formData.deduction}
                onChange={handleChange}
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter deduction percentage"
              />

              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter description"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLeaveRule(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deduction rule table */}

      <div className="mb-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Leave Rules</h2>
          <button
            onClick={() => setDeductionRule(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Deduction Rule
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Rule ID</th>
              <th className="border px-4 py-2">Deduction Type</th>
              <th className="border px-4 py-2">Deduction</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deductionRuleData.map((dRules) => (
              <tr key={dRules.id}>
                <td className="border px-4 py-2">{dRules.id}</td>
                <td className="border px-4 py-2">{dRules.deductionType}</td>
                <td className="border px-4 py-2">
                  {dRules.deductionPercent}% of day salary
                </td>
                <td className="border px-4 py-2">
                  {dRules.description} day salary
                </td>
                <td className="border px-4 py-2 text-blue-600 cursor-pointer">
                  Edit | Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Popup to add deduction rule */}
      {deductionRule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">
              Create a Deduction Rule
            </h3>
            <form onSubmit={handleDeductionSubmit}>
              <label className="block mb-2">Deduction Type</label>
              <select
                name="deductionType"
                value={deductionFormData.deductionType}
                onChange={handleDeductionChange}
                className="border rounded p-2 w-full mb-4"
              >
                <option value="">Select Deduction type</option>
                {deductionTypes.map((type) => (
                  <option value={type} key={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label className="block mb-2">Deduction %</label>
              <input
                type="number"
                name="deductionPercent"
                value={deductionFormData.deductionPercent}
                onChange={handleDeductionChange}
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter deduction percentage"
              />

              <label className="block mb-2">Description</label>
              <textarea
                name="description"
                value={deductionFormData.description}
                onChange={handleDeductionChange}
                className="border rounded p-2 w-full mb-4"
                placeholder="Enter description"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeductionRule(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveAndDeduction;
