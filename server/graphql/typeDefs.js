exports.typeDefs = `
  type Employee {
    _id: String,
    firstName: String,
    lastName: String,
    age: Int,
    dateOfJoining: String,
    title: String,
    department: String,
    employeeType: String,
    currentStatus: Boolean
  }
  type Query {
    employeeList: [Employee],
    getSingleEmployee(_id: String): Employee,
    filteredEmployeeData(
      title: String,
      employeeType: String,
      department: String): [Employee],
    upComingFilteredEmployeeList(employeeType: String) : [Employee]
  }
  type Mutation {
    createEmployee(
      firstName: String,
      lastName: String,
      age: Int,
      dateOfJoining: String,
      title: String,
      employeeType: String,
      department: String,
    ): Employee,
    updateEmployee(
      _id: String
      title: String, 
      department: String,
      currentStatus: Boolean
    ): Employee,
    deleteEmployee(_id: String): Employee
  }
`;
