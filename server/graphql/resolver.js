const Employee = require("../model/employee");

const employeeList = async () => {
  // provide all the employees from database
  return await Employee.find();
};

const getSingleEmployee = async (_, { _id }) => {
  // provide only single employee from DB based on id
  return await Employee.findById(_id);
};

const filteredEmployeeData = async (_, { title, department, employeeType }) => {
  const query = {};

  if (
    title === "Select Title" &&
    department === "Select Department" &&
    employeeType !== "Select Employee Type"
  ) {
    query.employeeType = employeeType;
  }
  if (
    employeeType === "Select Employee Type" &&
    department === "Select Department" &&
    title !== "Select Title"
  ) {
    query.title = title;
  }
  if (
    title === "Select Title" &&
    employeeType === "Select Employee Type" &&
    department !== "Select Department"
  ) {
    query.department = department;
  }
  if (
    title === "Select Title" &&
    department !== "Select Department" &&
    employeeType !== "Select Employee Type"
  ) {
    query.department = department;
    query.employeeType = employeeType;
  }
  if (
    title !== "Select Title" &&
    department === "Select Department" &&
    employeeType !== "Select Employee Type"
  ) {
    query.title = title;
    query.employeeType = employeeType;
  }
  if (
    title !== "Select Title" &&
    department !== "Select Department" &&
    employeeType === "Select Employee Type"
  ) {
    query.department = department;
    query.title = title;
  }

  // get back filtered data based on these three fields
  return await Employee.find(query);
};

const upComingFilteredEmployeeList = async (_, { employeeType }) => {
  // get back upoming employee filtered data based on the field
  return await Employee.find({
    employeeType,
    currentStatus: true,
  });
};

const createEmployee = async (
  _,
  { firstName, lastName, age, dateOfJoining, title, department, employeeType }
) => {
  // create employee
  return await Employee.create({
    firstName,
    lastName,
    age,
    dateOfJoining,
    title,
    department,
    employeeType,
  });
};

const updateEmployee = async (_, { _id, title, department, currentStatus }) => {
  return await Employee.findByIdAndUpdate(
    {
      _id,
    },
    {
      title,
      department,
      currentStatus,
    },
    {
      new: true,
    }
  );
};

const deleteEmployee = async (_, { _id }) => {
  return await Employee.findByIdAndDelete(_id);
};

exports.resolvers = {
  Query: {
    employeeList,
    getSingleEmployee,
    filteredEmployeeData,
    upComingFilteredEmployeeList,
  },
  Mutation: {
    createEmployee,
    updateEmployee,
    deleteEmployee,
  },
};
