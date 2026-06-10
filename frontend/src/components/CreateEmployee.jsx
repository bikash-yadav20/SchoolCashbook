import React, { useState } from "react";
import { createEmployee } from "../api/employee";
import { toast } from "react-toastify";

const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    employeeId: "",
    email: "",
    phone: "",
    password: "",
    designation: "",
    salary: "",
    pf: "",
    DOB: "",
    accountNumber: "",
    ifsc: "",
    presentAddress: "",
    permanentAddress: "",
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
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      const response = await createEmployee(data);
      toast.success("Employee created successfully");
      setFormData({
        firstname: "",
        lastname: "",
        employeeId: "",
        email: "",
        phone: "",
        password: "",
        designation: "",
        salary: "",
        pf: "",
        DOB: "",
        accountNumber: "",
        ifsc: "",
        presentAddress: "",
        permanentAddress: "",
        profile: null,
      });
    } catch (error) {
      console.log(
        "Error creating employee:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Create New Employee
          </h2>
          <p className="text-gray-500 mt-2">
            Fill in the details to register a new employee
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
              <div className="flex">
                <label htmlFor="designation">Designation</label>
                <select
                  name="designation"
                  id="designation"
                  value={formData.designation}
                  onChange={handleChange}
                >
                  <option value="principle"> Principal</option>
                  <option value="teacher">Teacher</option>
                  <option value="assistant-teacher">Assistant-teacher</option>
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

/* Reusable Input Component */
const InputField = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
    />
  </div>
);

export default CreateEmployee;
