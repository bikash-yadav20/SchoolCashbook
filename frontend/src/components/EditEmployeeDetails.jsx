import React, { useState } from "react";
import { toast } from "react-toastify";
import InputField from "./InputField";
import { updateEmployee } from "../api/employee";

const EditEmployeeDetails = ({ employee }) => {
  const [formData, setFormData] = useState({
    firstname: employee?.firstname || "",
    lastname: employee?.lastname || "",
    employeeId: employee?.employeeId || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    password: "",
    salary: employee?.salary || "",
    pf: employee?.pf || "",
    DOB: employee?.DOB || "",
    designation: employee?.designation || "",
    accountNumber: employee?.accountNumber || "",
    ifsc: employee?.ifsc || "",
    presentAddress: employee?.presentAddress || "",
    permanentAddress: employee?.permanentAddress || "",
    profile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateEmployee(formData, employee.employeeId);
      toast.success("Employee updated successfully");
      console.log("Update done", updated);
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Edit Employee Details
          </h2>
          <p className="text-gray-500 mt-2">
            Update the details of the employee
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              name="profile"
              accept="image/png, image/jpeg"
              onChange={handleChange}
              className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            />
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Personal Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
              />
              <InputField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
              />
              <InputField
                label="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputField
                label="Salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
              />
              <InputField
                label="Provident fund(PF)"
                name="pf"
                type="number"
                value={formData.pf}
                onChange={handleChange}
              />
              <InputField
                label="DOB"
                name="DOB"
                type="date"
                value={formData.DOB}
                onChange={handleChange}
              />
              <div className="flex flex-col">
                <label htmlFor="designation">Designation</label>
                <select
                  name="designation"
                  id="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="border rounded px-3 py-2"
                >
                  <option value="principle">Principal</option>
                  <option value="teacher">Teacher</option>
                  <option value="assistant-teacher">Assistant Teacher</option>
                  <option value="office-employee">Office Employee</option>
                  <option value="grade-iv">Grade IV</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Bank Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Account Number"
                name="accountNumber"
                type="number"
                value={formData.accountNumber}
                onChange={handleChange}
              />
              <InputField
                label="IFSC Code"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
              Address Details
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Present Address"
                name="presentAddress"
                value={formData.presentAddress}
                onChange={handleChange}
              />
              <InputField
                label="Permanent Address"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeDetails;
