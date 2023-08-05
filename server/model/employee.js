const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  age: {
    type: Number,
    min: 20,
    max: 70,
  },
  dateOfJoining: Date,
  title: String,
  department: String,
  employeeType: String,
  currentStatus: {
    type: Boolean,
    default: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
